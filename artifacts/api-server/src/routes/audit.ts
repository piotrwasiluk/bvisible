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

  // Create a new free workspace for this audit
  const [created] = await db
    .insert(workspacesTable)
    .values({ brandName, websiteUrl, type: "free" })
    .returning();
  const workspaceId = created.id;

  // Generate prompts via Gemini
  let generatedPrompts: string[] = [];

  if (process.env.GOOGLE_API_KEY) {
    try {
      const genai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
      const result = await genai.models.generateContent({
        model: "gemini-2.0-flash-lite",
        contents: `You are an AEO (Answer Engine Optimization) expert. Visit this website: ${websiteUrl} (brand name: "${brandName}").

First, understand what the company does — their product/service category, the problems they solve, and who their target customers are.

Then generate exactly 10 search prompts that a PROSPECTIVE CUSTOMER would type into an AI assistant (ChatGPT, Gemini, Perplexity, Claude) when looking for a solution in this category. These are people who don't know about ${brandName} yet — they're searching for a solution to their problem.

Requirements:
- Prompts must be category-level and use-case-driven, NOT brand-specific
- Do NOT include the brand name "${brandName}" in any prompt
- Do NOT generate prompts like "alternatives to X" or "X reviews" — these are brand-aware queries
- Focus on what a buyer would search BEFORE they know about ${brandName}
- Mix of: discovery ("best tool for..."), how-to ("how do I..."), comparison ("X vs Y category"), and decision queries
- Natural conversational questions, not keywords
- Each prompt on its own line, numbered 1-10
- No explanations, just the prompts

Example (for a cloud IDE company):
1. What is the best online coding environment for beginners?
2. How do I build a web app without setting up a local dev environment?
3. What tools do professional developers use for pair programming?
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

  // Fallback prompts if LLM fails — generic category-level questions
  if (generatedPrompts.length < 5) {
    // Extract a rough category from the domain for fallback
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
