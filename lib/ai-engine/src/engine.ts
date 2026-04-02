import { db } from "@workspace/db";
import {
  workspacesTable,
  promptsTable,
  promptExecutionsTable,
  mentionsTable,
  citationsTable,
} from "@workspace/db";
import { eq } from "drizzle-orm";
import type { ProviderAdapter, WorkspaceContext } from "./types.js";
import { extractMentions } from "./analysis/mentions.js";
import { classifyCitations } from "./analysis/citations.js";
import { analyzeSentiment } from "./analysis/sentiment.js";
import { aggregateDailyMetrics } from "./aggregator.js";
import { RateLimiter, getProviderRateLimit } from "./rate-limiter.js";

import { OpenAIAdapter } from "./providers/openai.js";
import { GeminiAdapter } from "./providers/gemini.js";
import { PerplexityAdapter } from "./providers/perplexity.js";
import { ClaudeAdapter } from "./providers/claude.js";
import { DataForSEOAdapter } from "./providers/dataforseo.js";

function extractDomain(url: string): string {
  try {
    return new URL(
      url.startsWith("http") ? url : `https://${url}`,
    ).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function getAvailableAdapters(): ProviderAdapter[] {
  const all: ProviderAdapter[] = [
    new OpenAIAdapter(),
    new GeminiAdapter(),
    new PerplexityAdapter(),
    new ClaudeAdapter(),
    new DataForSEOAdapter(),
  ];
  return all.filter((a) => a.isAvailable());
}

function workspaceToContext(ws: {
  id: number;
  brandName: string;
  websiteUrl: string;
  competitor1Url: string | null;
  competitor2Url: string | null;
  competitor3Url: string | null;
  region: string;
}): WorkspaceContext {
  return {
    id: ws.id,
    brandName: ws.brandName,
    websiteUrl: ws.websiteUrl,
    competitors: [
      ws.competitor1Url,
      ws.competitor2Url,
      ws.competitor3Url,
    ].filter((u): u is string => !!u),
    region: ws.region,
  };
}

interface PromptRow {
  id: number;
  text: string;
  topicId: number | null;
}

/**
 * Process a single (prompt, provider) pair: query, analyze, store.
 */
async function processPromptForProvider(
  prompt: PromptRow,
  workspace: WorkspaceContext,
  adapter: ProviderAdapter,
  competitorNames: string[],
): Promise<{ success: boolean }> {
  try {
    const response = await adapter.query(prompt.text);

    const [execution] = await db
      .insert(promptExecutionsTable)
      .values({
        workspaceId: workspace.id,
        promptId: prompt.id,
        platform: response.platform,
        rawResponse: response.rawText,
        region: workspace.region,
        executedAt: response.executedAt,
      })
      .returning();

    const mentions = extractMentions(
      response.rawText,
      workspace.brandName,
      competitorNames,
    );

    const citations = classifyCitations(response.citations, workspace);

    let sentimentScore = 50;
    if (mentions.some((m) => m.isOwnBrand)) {
      sentimentScore = await analyzeSentiment(
        response.rawText,
        workspace.brandName,
      );
    }

    if (mentions.length > 0) {
      await db.insert(mentionsTable).values(
        mentions.map((m) => ({
          workspaceId: workspace.id,
          executionId: execution.id,
          brandName: m.brandName,
          isOwnBrand: m.isOwnBrand,
          position: m.position,
          sentimentScore: m.isOwnBrand ? sentimentScore : null,
        })),
      );
    }

    if (citations.length > 0) {
      await db.insert(citationsTable).values(
        citations.map((c) => ({
          workspaceId: workspace.id,
          executionId: execution.id,
          url: c.url,
          domain: c.domain,
          domainType: c.domainType,
          pageType: c.pageType,
          influenceScore: c.influenceScore,
          domainAuthority: c.domainAuthority,
          hasBrandReference: c.hasBrandReference,
          competitorReferences: c.competitorReferences,
        })),
      );
    }

    return { success: true };
  } catch (err) {
    console.error(
      `  [${adapter.name}] Failed for "${prompt.text.slice(0, 50)}...":`,
      err instanceof Error ? err.message : err,
    );
    return { success: false };
  }
}

/**
 * Run all prompts for a workspace against a single provider,
 * respecting rate limits via the provided RateLimiter.
 */
async function runProviderForWorkspace(
  adapter: ProviderAdapter,
  limiter: RateLimiter,
  prompts: PromptRow[],
  workspace: WorkspaceContext,
  competitorNames: string[],
): Promise<{ provider: string; successes: number; failures: number }> {
  let successes = 0;
  let failures = 0;

  // Process all prompts concurrently within rate limits
  const results = await Promise.allSettled(
    prompts.map((prompt) =>
      limiter.execute(async () => {
        const result = await processPromptForProvider(
          prompt,
          workspace,
          adapter,
          competitorNames,
        );
        if (result.success) successes++;
        else failures++;
        return result;
      }),
    ),
  );

  // Count any Promise rejections (shouldn't happen since processPromptForProvider catches errors)
  for (const r of results) {
    if (r.status === "rejected") failures++;
  }

  return { provider: adapter.name, successes, failures };
}

/**
 * Run analysis for a single workspace across all providers in parallel.
 * Each provider gets its own rate limiter.
 */
async function runWorkspaceAnalysis(
  workspace: WorkspaceContext,
  prompts: PromptRow[],
  adapters: ProviderAdapter[],
  limiters: Map<string, RateLimiter>,
): Promise<{ successes: number; failures: number }> {
  const competitorNames = workspace.competitors.map((url) => {
    const d = extractDomain(url);
    const name = d.split(".")[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  });

  console.log(
    `  [${workspace.brandName}] Running ${prompts.length} prompts × ${adapters.length} providers...`,
  );

  // Run ALL providers in parallel — each has its own rate limiter
  const providerResults = await Promise.all(
    adapters.map((adapter) => {
      const limiter = limiters.get(adapter.name)!;
      return runProviderForWorkspace(
        adapter,
        limiter,
        prompts,
        workspace,
        competitorNames,
      );
    }),
  );

  let totalSuccesses = 0;
  let totalFailures = 0;
  for (const r of providerResults) {
    console.log(
      `  [${workspace.brandName}][${r.provider}] ${r.successes}/${prompts.length} succeeded`,
    );
    totalSuccesses += r.successes;
    totalFailures += r.failures;
  }

  // Aggregate daily metrics for this workspace
  await aggregateDailyMetrics(workspace.id);

  return { successes: totalSuccesses, failures: totalFailures };
}

/**
 * Run the full daily analysis for one or all workspaces.
 *
 * Architecture for 100 customers:
 * - All 5 providers run in parallel (separate rate limiters)
 * - Within each provider, prompts are concurrent up to the RPM/concurrency limit
 * - Workspaces are processed in batches to avoid memory pressure
 *
 * For 100 workspaces × 50 prompts × 5 providers:
 * - Total API calls: 25,000
 * - Wall clock (all providers parallel): ~100 min (bottleneck: Perplexity/Claude at 50 RPM)
 * - Higher API tiers reduce this significantly
 */
export async function runDailyAnalysis(workspaceId?: number): Promise<{
  promptCount: number;
  platforms: string[];
  successes: number;
  failures: number;
}> {
  const adapters = getAvailableAdapters();
  if (adapters.length === 0) {
    throw new Error("No AI providers configured. Set at least one API key.");
  }

  // Create rate limiters — one per provider, shared across all workspaces
  const limiters = new Map<string, RateLimiter>();
  for (const adapter of adapters) {
    const { rpm, concurrency } = getProviderRateLimit(adapter.name);
    limiters.set(adapter.name, new RateLimiter(rpm, concurrency));
    console.log(
      `[Engine] ${adapter.name}: ${rpm} RPM, ${concurrency} concurrent`,
    );
  }

  // Get workspaces — when running via cron (no explicit ID), only process paid workspaces
  const workspaces = workspaceId
    ? await db
        .select()
        .from(workspacesTable)
        .where(eq(workspacesTable.id, workspaceId))
    : await db
        .select()
        .from(workspacesTable)
        .where(eq(workspacesTable.type, "paid"));

  if (workspaces.length === 0) {
    throw new Error("No workspaces configured");
  }

  console.log(
    `[Engine] Processing ${workspaces.length} workspace(s) across ${adapters.length} providers`,
  );

  let totalPrompts = 0;
  let totalSuccesses = 0;
  let totalFailures = 0;

  // Process workspaces in batches of 10 to control memory
  const WORKSPACE_BATCH = 10;
  for (let i = 0; i < workspaces.length; i += WORKSPACE_BATCH) {
    const batch = workspaces.slice(i, i + WORKSPACE_BATCH);

    const batchResults = await Promise.all(
      batch.map(async (ws) => {
        const workspace = workspaceToContext(ws);
        const prompts = await db
          .select()
          .from(promptsTable)
          .where(eq(promptsTable.workspaceId, workspace.id));

        if (prompts.length === 0) {
          console.log(`  [${workspace.brandName}] No prompts, skipping.`);
          return { promptCount: 0, successes: 0, failures: 0 };
        }

        totalPrompts += prompts.length;
        return runWorkspaceAnalysis(workspace, prompts, adapters, limiters);
      }),
    );

    for (const r of batchResults) {
      totalSuccesses += r.successes;
      totalFailures += r.failures;
    }
  }

  console.log(
    `[Engine] Done. ${totalSuccesses} successes, ${totalFailures} failures across ${workspaces.length} workspace(s).`,
  );

  return {
    promptCount: totalPrompts,
    platforms: adapters.map((a) => a.name),
    successes: totalSuccesses,
    failures: totalFailures,
  };
}
