import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { pagesTable } from "@workspace/db";
import { ilike, sql, asc, desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/pages", async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(
    100,
    Math.max(1, parseInt(req.query.limit as string) || 50),
  );
  const offset = (page - 1) * limit;
  const search = (req.query.search as string) || "";
  const sortParam = (req.query.sort as string) || "";
  const view = (req.query.view as string) || "page";

  const conditions = [];
  if (search) {
    conditions.push(ilike(pagesTable.url, `%${search}%`));
  }

  const whereClause = conditions.length > 0 ? conditions[0] : undefined;

  const countResult = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(pagesTable)
    .where(whereClause);
  const total = countResult[0]?.count || 0;

  let orderBy: ReturnType<typeof asc> = desc(pagesTable.citationCount);
  if (sortParam) {
    const descending = sortParam.startsWith("-");
    const field = descending ? sortParam.slice(1) : sortParam;
    const dir = descending ? desc : asc;
    switch (field) {
      case "url":
        orderBy = dir(pagesTable.url);
        break;
      case "clicks":
        orderBy = dir(pagesTable.clicks);
        break;
      case "impressions":
        orderBy = dir(pagesTable.impressions);
        break;
      case "position":
        orderBy = dir(pagesTable.position);
        break;
      case "ctr":
        orderBy = dir(pagesTable.ctr);
        break;
      case "citationCount":
        orderBy = dir(pagesTable.citationCount);
        break;
      case "citationRate":
        orderBy = dir(pagesTable.citationRate);
        break;
      default:
        orderBy = desc(pagesTable.citationCount);
    }
  }

  const rows = await db
    .select()
    .from(pagesTable)
    .where(whereClause)
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset);

  const items = rows.map((r) => ({
    id: r.id,
    url: r.url,
    folder: r.folder,
    primaryKeyword: r.primaryKeyword,
    clicks: r.clicks,
    clicksChange: r.clicksChange,
    impressions: r.impressions,
    impressionsChange: r.impressionsChange,
    position: r.position,
    positionChange: r.positionChange,
    ctr: r.ctr,
    ctrChange: r.ctrChange,
    citationCount: r.citationCount,
    citationCountChange: r.citationCountChange,
    citationRate: r.citationRate,
    citationRateChange: r.citationRateChange,
  }));

  res.json({ items, total, page, limit });
});

export default router;
