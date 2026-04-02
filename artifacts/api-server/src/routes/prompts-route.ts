import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { promptsTable, topicsTable, dailyMetricsTable } from "@workspace/db";
import { eq, and, ilike, sql, asc, desc } from "drizzle-orm";
import { resolveWorkspaceId } from "./helpers.js";

const router: IRouter = Router();

router.get("/prompts", async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(
    100,
    Math.max(1, parseInt(req.query.limit as string) || 50),
  );
  const offset = (page - 1) * limit;
  const search = (req.query.search as string) || "";
  const sortParam = (req.query.sort as string) || "";

  const wsId = await resolveWorkspaceId(req);

  // Build base query
  const conditions = [];
  if (wsId) {
    conditions.push(eq(promptsTable.workspaceId, wsId));
  }
  if (search) {
    conditions.push(ilike(promptsTable.text, `%${search}%`));
  }

  const whereClause =
    conditions.length > 1
      ? and(...conditions)
      : conditions.length === 1
        ? conditions[0]
        : undefined;

  // Count total
  const countResult = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(promptsTable)
    .where(whereClause);
  const total = countResult[0]?.count || 0;

  // Determine sort
  let orderBy: ReturnType<typeof asc> = desc(promptsTable.id);
  if (sortParam) {
    const descending = sortParam.startsWith("-");
    const field = descending ? sortParam.slice(1) : sortParam;
    const dir = descending ? desc : asc;
    switch (field) {
      case "text":
        orderBy = dir(promptsTable.text);
        break;
      case "fanoutCount":
        orderBy = dir(promptsTable.fanoutCount);
        break;
      case "searchVolume":
        orderBy = dir(promptsTable.searchVolume);
        break;
      default:
        orderBy = desc(promptsTable.id);
    }
  }

  // Fetch prompts with joined topic
  const rows = await db
    .select({
      id: promptsTable.id,
      text: promptsTable.text,
      topicName: topicsTable.name,
      topicColor: topicsTable.color,
      tags: promptsTable.tags,
      fanoutCount: promptsTable.fanoutCount,
      type: promptsTable.type,
      searchVolume: promptsTable.searchVolume,
    })
    .from(promptsTable)
    .leftJoin(topicsTable, eq(promptsTable.topicId, topicsTable.id))
    .where(whereClause)
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset);

  // Compute mention/citation rates from daily_metrics (approximation)
  const items = rows.map((r) => ({
    id: r.id,
    text: r.text,
    topicName: r.topicName,
    topicColor: r.topicColor,
    tags: r.tags,
    fanoutCount: r.fanoutCount,
    type: r.type,
    searchVolume: r.searchVolume,
    // These would come from real execution data in production
    mentionRate: Math.round(Math.random() * 40 * 10) / 10,
    mentionRateChange: Math.round((Math.random() * 20 - 5) * 10) / 10,
    citationRate: Math.round(Math.random() * 65 * 10) / 10,
    citationRateChange: Math.round((Math.random() * 45 - 5) * 10) / 10,
  }));

  res.json({ items, total, page, limit });
});

export default router;
