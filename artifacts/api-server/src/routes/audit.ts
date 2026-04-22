import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { workspacesTable, topicsTable, promptsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  runDailyAnalysis,
  isAnalysisRunning,
  setRunning,
} from "@workspace/ai-engine";
import { z } from "zod";
import OpenAI from "openai";

const router: IRouter = Router();

const GeneratePromptsBody = z.object({
  websiteUrl: z.string().url("Valid URL required"),
});

const SYSTEM_PROMPT =
  "You are an expert in AI search optimization and answer engine visibility strategy, with deep understanding of how users query LLMs for product and service recommendations.";

function buildUserPrompt(websiteUrl: string): string {
  return `Generate 10 high-intent prompts that the company would want to rank for in LLM-based answer engines. These should be between 5 to 10 words. For example, for a procurement AI platform they would look something like this:
- What's the best procurement platform for manufacturers
- What is the best supply chain software
- Best payment automation software for suppliers

<website>${websiteUrl}</website>

The prompts should cover a mix of intent types:
- Purchase/conversion intent (e.g., "best [product type] for [specific use case]")
- Information-seeking with commercial undertones (e.g., "how to choose a [product type]")
- Problem-solution queries (e.g., "[specific problem] solutions for [target audience]")

Tailor the prompts based on:
- The company's products/services (visit the website to understand)
- The target customer profile
- The competitive landscape
- Pain points the company's offerings solve

Ensure the prompts are:
- Conversational and natural (how real users would ask an AI assistant)
- Focused on queries where the company would be a relevant answer
- Varied across different stages of the buyer journey

Output format: A simple JSON array containing exactly 10 prompt strings.`;
}

/**
 * POST /api/audit/generate-prompts
 * Takes a website URL, uses OpenAI (gpt-5.4 + web search) to understand the
 * brand and generate 10 relevant search prompts, creates workspace + prompts
 * in DB.
 */
router.post("/audit/generate-prompts", async (req, res) => {
  const parsed = GeneratePromptsBody.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ error: "validation_error", message: parsed.error.message });
    return;
  }

  const { websiteUrl } = parsed.data;

  // Derive brand name from URL hostname
  let brandName = "Brand";
  try {
    const hostname = new URL(websiteUrl).hostname.replace(/^www\./, "");
    const first = hostname.split(".")[0];
    brandName = first.charAt(0).toUpperCase() + first.slice(1);
  } catch {
    // keep default
  }

  // Create a new free workspace for this audit
  const [created] = await db
    .insert(workspacesTable)
    .values({ brandName, websiteUrl, type: "free" })
    .returning();
  const workspaceId = created.id;

  // Generate prompts via OpenAI Responses API with web_search
  let generatedPrompts: string[] = [];

  if (process.env.OPENAI_API_KEY) {
    try {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const response = await openai.responses.create({
        model: "gpt-5.4",
        input: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: buildUserPrompt(websiteUrl) },
        ],
        tools: [{ type: "web_search" as const }],
      });

      let text = "";
      for (const item of response.output) {
        if (item.type === "message") {
          for (const block of item.content) {
            if (block.type === "output_text") text += block.text;
          }
        }
      }

      const match = text.match(/\[[\s\S]*\]/);
      if (match) {
        const parsedArray = JSON.parse(match[0]) as unknown;
        if (Array.isArray(parsedArray)) {
          generatedPrompts = parsedArray
            .filter((p): p is string => typeof p === "string" && p.length > 4)
            .slice(0, 10);
        }
      }
    } catch (err) {
      console.error("OpenAI prompt generation failed:", err);
    }
  }

  // Fallback prompts if LLM fails — generic category-level questions
  if (generatedPrompts.length < 5) {
    const domain = new URL(websiteUrl).hostname.replace(/^www\./, "");
    generatedPrompts = [
      `What is the best software for businesses like ${domain}?`,
      `How do I choose the right tool for my team?`,
      `What are the top solutions in this category in 2026?`,
      `How do small businesses solve this problem?`,
      `What should I look for when evaluating tools like this?`,
      `Free vs paid tools — which is better for startups?`,
      `What do experts recommend for this use case?`,
      `How do enterprise teams handle this workflow?`,
      `What are the most popular options for this category?`,
      `Is it better to build or buy a solution for this?`,
    ];
  }

  // Create a default topic
  const existingTopics = await db
    .select()
    .from(topicsTable)
    .where(eq(topicsTable.workspaceId, workspaceId))
    .limit(1);

  let topicId: number;
  if (existingTopics.length > 0) {
    topicId = existingTopics[0].id;
  } else {
    const [topic] = await db
      .insert(topicsTable)
      .values({ workspaceId, name: "General", color: "blue" })
      .returning();
    topicId = topic.id;
  }

  // Clear existing prompts for this workspace (fresh audit)
  await db
    .delete(promptsTable)
    .where(eq(promptsTable.workspaceId, workspaceId));

  // Insert prompts
  const prompts = await db
    .insert(promptsTable)
    .values(
      generatedPrompts.map((text) => ({
        workspaceId,
        topicId,
        text,
        type: "Category Related",
        fanoutCount: 1,
      })),
    )
    .returning();

  res.json({
    workspaceId,
    brandName,
    prompts: prompts.map((p) => ({ id: p.id, text: p.text })),
  });
});

/**
 * POST /api/audit/run
 * Triggers the analysis engine for a workspace.
 */
router.post("/audit/run", async (req, res) => {
  const { workspaceId } = req.body as { workspaceId?: number };

  if (isAnalysisRunning()) {
    res
      .status(409)
      .json({ error: "conflict", message: "Analysis already running" });
    return;
  }

  setRunning(true);

  runDailyAnalysis(workspaceId || undefined)
    .then((result: { successes: number; failures: number }) => {
      console.log(
        `[Audit] Completed: ${result.successes} successes, ${result.failures} failures`,
      );
    })
    .catch((err: unknown) => {
      console.error("[Audit] Failed:", err);
    })
    .finally(() => {
      setRunning(false);
    });

  res.json({ status: "started" });
});

/**
 * GET /api/audit/status
 * Returns whether analysis is currently running.
 */
router.get("/audit/status", async (_req, res) => {
  res.json({ running: isAnalysisRunning() });
});

export default router;
