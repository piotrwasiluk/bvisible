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
import { GoogleGenAI } from "@google/genai";

const router: IRouter = Router();

const GeneratePromptsBody = z.object({
  websiteUrl: z.string().url("Valid URL required"),
  brandName: z.string().optional(),
});

/**
 * POST /api/audit/generate-prompts
 * Takes a website URL, uses Gemini to understand the brand and generate
 * 10 relevant search prompts, creates workspace + prompts in DB.
 */
router.post("/audit/generate-prompts", async (req, res) => {
  const parsed = GeneratePromptsBody.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ error: "validation_error", message: parsed.error.message });
    return;
  }

  const { websiteUrl, brandName: providedName } = parsed.data;

  // Derive brand name from URL if not provided
  let brandName = providedName || "";
  if (!brandName) {
    try {
      const hostname = new URL(websiteUrl).hostname.replace(/^www\./, "");
      const parts = hostname.split(".");
      brandName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
    } catch {
      brandName = "Brand";
    }
  }

  // Create or update workspace
  const existing = await db.select().from(workspacesTable).limit(1);
  let workspaceId: number;

  if (existing.length > 0) {
    const [updated] = await db
      .update(workspacesTable)
      .set({
        brandName,
        websiteUrl,
        updatedAt: new Date(),
      })
      .where(eq(workspacesTable.id, existing[0].id))
      .returning();
    workspaceId = updated.id;
  } else {
    const [created] = await db
      .insert(workspacesTable)
      .values({ brandName, websiteUrl })
      .returning();
    workspaceId = created.id;
  }

  // Generate prompts via Gemini
  let generatedPrompts: string[] = [];

  if (process.env.GOOGLE_API_KEY) {
    try {
      const genai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
      const result = await genai.models.generateContent({
        model: "gemini-2.0-flash-lite",
        contents: `You are an AEO (Answer Engine Optimization) expert. Given this brand website: ${websiteUrl} (brand name: "${brandName}"), generate exactly 10 search prompts that real users would ask AI assistants (ChatGPT, Gemini, Perplexity, Claude) about this brand's industry and product category.

Requirements:
- Prompts should be natural conversational questions, NOT keywords
- Mix of informational, comparison, and decision-making queries
- Include prompts where the brand SHOULD appear in AI answers
- Include prompts about the broader category (not just the brand)
- Each prompt on its own line, numbered 1-10
- No explanations, just the prompts

Example format:
1. What's the best tool for [category] in 2026?
2. How do I [solve problem the brand addresses]?
...`,
      });

      const text = result.text || "";
      generatedPrompts = text
        .split("\n")
        .map((line) => line.replace(/^\d+[\.\)]\s*/, "").trim())
        .filter((line) => line.length > 10 && line.length < 300)
        .slice(0, 10);
    } catch (err) {
      console.error("Gemini prompt generation failed:", err);
    }
  }

  // Fallback prompts if LLM fails
  if (generatedPrompts.length < 5) {
    generatedPrompts = [
      `What is ${brandName} and what do they do?`,
      `Best alternatives to ${brandName}`,
      `${brandName} reviews and pricing`,
      `How does ${brandName} compare to competitors?`,
      `Is ${brandName} worth it for small businesses?`,
      `What are the pros and cons of ${brandName}?`,
      `How to get started with ${brandName}`,
      `${brandName} vs competitors in 2026`,
      `What problems does ${brandName} solve?`,
      `Who should use ${brandName}?`,
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
