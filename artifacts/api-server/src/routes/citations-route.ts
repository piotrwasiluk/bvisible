import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { citationsTable } from "@workspace/db";
import { ilike, sql, asc, desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/citations", async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(
    100,
    Math.max(1, parseInt(req.query.limit as string) || 50),
  );
  const offset = (page - 1) * limit;
  const search = (req.query.search as string) || "";
  const view = (req.query.view as string) || "url";

  const conditions = [];
  if (search) {
    conditions.push(ilike(citationsTable.url, `%${search}%`));
  }

  const whereClause = conditions.length > 0 ? conditions[0] : undefined;

  if (view === "domain") {
    // Group by domain
    const domainRows = await db
      .select({
        domain: citationsTable.domain,
        domainType: citationsTable.domainType,
        domainAuthority: sql<number>`max(${citationsTable.domainAuthority})`,
        hasBrandReference: sql<boolean>`bool_or(${citationsTable.hasBrandReference})`,
        influenceScore: sql<number>`max(${citationsTable.influenceScore})`,
        citations: sql<number>`count(*)::int`,
        uniqueUrls: sql<number>`count(distinct ${citationsTable.url})::int`,
      })
      .from(citationsTable)
      .groupBy(citationsTable.domain, citationsTable.domainType)
      .orderBy(sql`count(*) desc`)
      .limit(limit)
      .offset(offset);

    const countResult = await db
      .select({
        count: sql<number>`count(distinct ${citationsTable.domain})::int`,
      })
      .from(citationsTable);

    const items = domainRows.map((r, i) => ({
      id: i + 1 + offset,
      url: r.domain,
      domain: r.domain,
      domainType: r.domainType,
      pageType: null,
      influenceScore: r.influenceScore,
      domainAuthority: r.domainAuthority,
      hasBrandReference: r.hasBrandReference,
      competitorReferences: null,
      citations: r.citations,
    }));

    res.json({
      items,
      total: countResult[0]?.count || 0,
      page,
      limit,
    });
    return;
  }

  // URL view - aggregate citations per unique URL
  const urlRows = await db
    .select({
      url: citationsTable.url,
      domain: citationsTable.domain,
      domainType: citationsTable.domainType,
      pageType: sql<string>`max(${citationsTable.pageType})`,
      influenceScore: sql<number>`max(${citationsTable.influenceScore})`,
      domainAuthority: sql<number>`max(${citationsTable.domainAuthority})`,
      hasBrandReference: sql<boolean>`bool_or(${citationsTable.hasBrandReference})`,
      competitorReferences: sql<
        string[]
      >`array_agg(distinct unnest) filter (where unnest is not null)`,
      citations: sql<number>`count(*)::int`,
    })
    .from(citationsTable)
    .leftJoin(
      sql`lateral unnest(${citationsTable.competitorReferences})`,
      sql`true`,
    )
    .where(whereClause)
    .groupBy(
      citationsTable.url,
      citationsTable.domain,
      citationsTable.domainType,
    )
    .orderBy(sql`count(*) desc`)
    .limit(limit)
    .offset(offset);

  const countResult = await db
    .select({ count: sql<number>`count(distinct ${citationsTable.url})::int` })
    .from(citationsTable)
    .where(whereClause);

  const items = urlRows.map((r, i) => ({
    id: i + 1 + offset,
    url: r.url,
    domain: r.domain,
    domainType: r.domainType,
    pageType: r.pageType,
    influenceScore: r.influenceScore,
    domainAuthority: r.domainAuthority,
    hasBrandReference: r.hasBrandReference,
    competitorReferences: r.competitorReferences,
    citations: r.citations,
  }));

  res.json({ items, total: countResult[0]?.count || 0, page, limit });
});

export default router;
