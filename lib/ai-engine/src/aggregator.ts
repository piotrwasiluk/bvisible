import { db } from "@workspace/db";
import {
  promptExecutionsTable,
  mentionsTable,
  citationsTable,
  dailyMetricsTable,
  promptsTable,
  topicsTable,
} from "@workspace/db";
import { eq, and, gte, lte, sql } from "drizzle-orm";

/**
 * Aggregate today's execution data into daily_metrics rows.
 * Creates rows for: overall, per-platform, per-competitor.
 */
export async function aggregateDailyMetrics(
  workspaceId: number,
): Promise<void> {
  const today = new Date().toISOString().slice(0, 10);

  // Get today's executions
  const executions = await db
    .select()
    .from(promptExecutionsTable)
    .where(
      and(
        eq(promptExecutionsTable.workspaceId, workspaceId),
        gte(promptExecutionsTable.executedAt, new Date(`${today}T00:00:00Z`)),
        lte(promptExecutionsTable.executedAt, new Date(`${today}T23:59:59Z`)),
      ),
    );

  if (executions.length === 0) return;

  const executionIds = executions.map((e) => e.id);

  // Get all mentions for today's executions
  const mentions = await db
    .select()
    .from(mentionsTable)
    .where(
      sql`${mentionsTable.executionId} IN (${sql.join(
        executionIds.map((id) => sql`${id}`),
        sql`,`,
      )})`,
    );

  // Get all citations for today's executions
  const citations = await db
    .select()
    .from(citationsTable)
    .where(
      sql`${citationsTable.executionId} IN (${sql.join(
        executionIds.map((id) => sql`${id}`),
        sql`,`,
      )})`,
    );

  const totalExecs = executions.length;

  // Helper: calculate metrics from a subset of executions
  function calcMetrics(execSubset: typeof executions) {
    const subIds = new Set(execSubset.map((e) => e.id));
    const subMentions = mentions.filter((m) => subIds.has(m.executionId));
    const subCitations = citations.filter((c) => subIds.has(c.executionId));

    const ownMentions = subMentions.filter((m) => m.isOwnBrand);
    const allMentions = subMentions;
    const execsWithOwnMention = new Set(ownMentions.map((m) => m.executionId));
    const execsWithAnyCitation = new Set(
      subCitations.map((c) => c.executionId),
    );

    const mentionRate =
      execSubset.length > 0
        ? (execsWithOwnMention.size / execSubset.length) * 100
        : 0;

    const totalMentionCount = allMentions.length;
    const ownMentionCount = ownMentions.length;
    const shareOfVoice =
      totalMentionCount > 0 ? (ownMentionCount / totalMentionCount) * 100 : 0;

    const citationRate =
      execSubset.length > 0
        ? (execsWithAnyCitation.size / execSubset.length) * 100
        : 0;

    const totalCitCount = subCitations.length;
    const ownCitCount = subCitations.filter((c) => c.hasBrandReference).length;
    const citationShare =
      totalCitCount > 0 ? (ownCitCount / totalCitCount) * 100 : 0;

    const positions = ownMentions
      .filter((m) => m.position != null)
      .map((m) => m.position!);
    const avgPosition =
      positions.length > 0
        ? positions.reduce((a, b) => a + b, 0) / positions.length
        : 0;

    const sentiments = ownMentions
      .filter((m) => m.sentimentScore != null)
      .map((m) => m.sentimentScore!);
    const sentimentScore =
      sentiments.length > 0
        ? Math.round(sentiments.reduce((a, b) => a + b, 0) / sentiments.length)
        : 50;

    return {
      mentionRate: Math.round(mentionRate * 10) / 10,
      shareOfVoice: Math.round(shareOfVoice * 10) / 10,
      citationRate: Math.round(citationRate * 10) / 10,
      citationShare: Math.round(citationShare * 10) / 10,
      avgPosition: Math.round(avgPosition * 10) / 10,
      sentimentScore,
      totalMentions: ownMentionCount,
      totalCitations: totalCitCount,
      totalExecutions: execSubset.length,
    };
  }

  const rows: Array<{
    workspaceId: number;
    date: string;
    platform: string | null;
    topic: string | null;
    competitor: string | null;
    mentionRate: number;
    shareOfVoice: number;
    citationRate: number;
    citationShare: number;
    avgPosition: number;
    sentimentScore: number;
    totalMentions: number;
    totalCitations: number;
    totalExecutions: number;
  }> = [];

  // 1. Overall metrics (no dimension filter)
  const overall = calcMetrics(executions);
  rows.push({
    workspaceId,
    date: today,
    platform: null,
    topic: null,
    competitor: null,
    ...overall,
  });

  // 2. Per-platform metrics
  const platforms = [...new Set(executions.map((e) => e.platform))];
  for (const platform of platforms) {
    const subset = executions.filter((e) => e.platform === platform);
    const metrics = calcMetrics(subset);
    rows.push({
      workspaceId,
      date: today,
      platform,
      topic: null,
      competitor: null,
      ...metrics,
    });
  }

  // 3. Per-competitor metrics (based on mentions)
  const competitorNames = [
    ...new Set(mentions.filter((m) => !m.isOwnBrand).map((m) => m.brandName)),
  ];
  for (const comp of competitorNames) {
    // Find executions where this competitor was mentioned
    const compExecIds = new Set(
      mentions.filter((m) => m.brandName === comp).map((m) => m.executionId),
    );
    // We report competitor metrics against the full set of executions
    // to get their mention rate as a fraction of total
    const compMentions = mentions.filter((m) => m.brandName === comp);
    const compMentionRate =
      totalExecs > 0 ? (compExecIds.size / totalExecs) * 100 : 0;

    rows.push({
      workspaceId,
      date: today,
      platform: null,
      topic: null,
      competitor: comp,
      mentionRate: Math.round(compMentionRate * 10) / 10,
      shareOfVoice: 0,
      citationRate: 0,
      citationShare: 0,
      avgPosition:
        compMentions.length > 0
          ? Math.round(
              (compMentions
                .filter((m) => m.position != null)
                .reduce((a, m) => a + m.position!, 0) /
                compMentions.filter((m) => m.position != null).length) *
                10,
            ) / 10
          : 0,
      sentimentScore: 50,
      totalMentions: compMentions.length,
      totalCitations: 0,
      totalExecutions: totalExecs,
    });
  }

  // Delete existing rows for today (idempotent re-run)
  await db
    .delete(dailyMetricsTable)
    .where(
      and(
        eq(dailyMetricsTable.workspaceId, workspaceId),
        eq(dailyMetricsTable.date, today),
      ),
    );

  // Insert new rows
  if (rows.length > 0) {
    await db.insert(dailyMetricsTable).values(rows);
  }

  console.log(`  Aggregated ${rows.length} daily metric rows for ${today}`);
}
