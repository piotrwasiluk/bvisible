import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { topicsTable, dailyMetricsTable } from "@workspace/db";
import { sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/filters/options", async (_req, res) => {
  // Platforms
  const platformRows = await db
    .select({ platform: sql<string>`distinct ${dailyMetricsTable.platform}` })
    .from(dailyMetricsTable)
    .where(sql`${dailyMetricsTable.platform} IS NOT NULL`);
  const platforms = platformRows
    .map((r) => r.platform)
    .filter(Boolean)
    .sort();

  // Topics
  const topicRows = await db
    .select({ name: topicsTable.name })
    .from(topicsTable);
  const topics = topicRows.map((r) => r.name).sort();

  // Competitors
  const compRows = await db
    .select({
      competitor: sql<string>`distinct ${dailyMetricsTable.competitor}`,
    })
    .from(dailyMetricsTable)
    .where(sql`${dailyMetricsTable.competitor} IS NOT NULL`);
  const competitors = compRows
    .map((r) => r.competitor)
    .filter(Boolean)
    .sort();

  // Regions and personas (static for now)
  const regions = ["us-en", "gb-en", "de-de", "fr-fr"];
  const personas = ["Default"];

  res.json({ platforms, topics, competitors, regions, personas });
});

export default router;
