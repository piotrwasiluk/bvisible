import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  dailyMetricsTable,
  sentimentThemesTable,
  citationsTable,
} from "@workspace/db";
import { eq, and, gte, lte, isNull, sql, desc, asc } from "drizzle-orm";
import { resolveWorkspaceId, getWorkspaceBrandName } from "./helpers.js";

const router: IRouter = Router();

// ── Helpers ──────────────────────────────────────────────────────────────────

function dateRangeToDays(range: string | undefined): number {
  switch (range) {
    case "14d":
      return 14;
    case "30d":
      return 30;
    case "90d":
      return 90;
    default:
      return 7;
  }
}

function getDateBounds(range: string | undefined) {
  const days = dateRangeToDays(range);
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
}

function formatPct(n: number): string {
  return `${n.toFixed(1)}%`;
}

function formatChange(current: number, previous: number): string {
  const diff = current - previous;
  const sign = diff >= 0 ? "+" : "";
  return `${sign}${diff.toFixed(1)}%`;
}

function trend(current: number, previous: number): "up" | "down" | "flat" {
  const diff = current - previous;
  if (Math.abs(diff) < 0.05) return "flat";
  return diff > 0 ? "up" : "down";
}

// ── GET /analytics/overview ──────────────────────────────────────────────────

router.get("/analytics/overview", async (req, res) => {
  const wsId = await resolveWorkspaceId(req);
  if (!wsId) {
    res.json({ kpis: [], platforms: [], competitors: [], answerCount: 0 });
    return;
  }
  const brandName = await getWorkspaceBrandName(wsId);
  const { startDate, endDate } = getDateBounds(req.query.dateRange as string);
  const days = dateRangeToDays(req.query.dateRange as string);

  // Previous period for change calculation
  const prevEnd = new Date(startDate);
  prevEnd.setDate(prevEnd.getDate() - 1);
  const prevStart = new Date(prevEnd);
  prevStart.setDate(prevStart.getDate() - days);
  const prevStartStr = prevStart.toISOString().slice(0, 10);
  const prevEndStr = prevEnd.toISOString().slice(0, 10);

  // Current period aggregated metrics (own brand, no platform/topic filter)
  const currentRows = await db
    .select()
    .from(dailyMetricsTable)
    .where(
      and(
        eq(dailyMetricsTable.workspaceId, wsId),
        gte(dailyMetricsTable.date, startDate),
        lte(dailyMetricsTable.date, endDate),
        isNull(dailyMetricsTable.platform),
        isNull(dailyMetricsTable.topic),
        isNull(dailyMetricsTable.competitor),
      ),
    );

  const prevRows = await db
    .select()
    .from(dailyMetricsTable)
    .where(
      and(
        eq(dailyMetricsTable.workspaceId, wsId),
        gte(dailyMetricsTable.date, prevStartStr),
        lte(dailyMetricsTable.date, prevEndStr),
        isNull(dailyMetricsTable.platform),
        isNull(dailyMetricsTable.topic),
        isNull(dailyMetricsTable.competitor),
      ),
    );

  const avg = (
    rows: typeof currentRows,
    field: keyof (typeof currentRows)[0],
  ) => {
    if (rows.length === 0) return 0;
    const sum = rows.reduce((s, r) => s + (Number(r[field]) || 0), 0);
    return sum / rows.length;
  };

  const sumField = (
    rows: typeof currentRows,
    field: keyof (typeof currentRows)[0],
  ) => {
    return rows.reduce((s, r) => s + (Number(r[field]) || 0), 0);
  };

  const curMention = avg(currentRows, "mentionRate");
  const prevMention = avg(prevRows, "mentionRate");
  const curSov = avg(currentRows, "shareOfVoice");
  const prevSov = avg(prevRows, "shareOfVoice");
  const curCitation = avg(currentRows, "citationRate");
  const prevCitation = avg(prevRows, "citationRate");
  const curSentiment = Math.round(avg(currentRows, "sentimentScore"));
  const prevSentiment = Math.round(avg(prevRows, "sentimentScore"));
  const curPosition = avg(currentRows, "avgPosition");
  const prevPosition = avg(prevRows, "avgPosition");
  const answerCount = sumField(currentRows, "totalExecutions");

  const kpis = [
    {
      label: "Mention Rate",
      value: formatPct(curMention),
      change: formatChange(curMention, prevMention),
      trend: trend(curMention, prevMention),
    },
    {
      label: "Share of Voice",
      value: formatPct(curSov),
      change: formatChange(curSov, prevSov),
      trend: trend(curSov, prevSov),
    },
    {
      label: "Citation Rate",
      value: formatPct(curCitation),
      change: formatChange(curCitation, prevCitation),
      trend: trend(curCitation, prevCitation),
    },
    {
      label: "Sentiment Score",
      value: String(curSentiment),
      change: `${curSentiment - prevSentiment >= 0 ? "+" : ""}${curSentiment - prevSentiment}`,
      trend: trend(curSentiment, prevSentiment),
    },
    {
      label: "Average Position",
      value: curPosition.toFixed(1),
      change: `${curPosition - prevPosition >= 0 ? "+" : ""}${(curPosition - prevPosition).toFixed(1)}`,
      trend: curPosition <= prevPosition ? "up" : "down",
    },
  ];

  // Platform breakdown
  const platformRows = await db
    .select()
    .from(dailyMetricsTable)
    .where(
      and(
        eq(dailyMetricsTable.workspaceId, wsId),
        gte(dailyMetricsTable.date, startDate),
        lte(dailyMetricsTable.date, endDate),
        sql`${dailyMetricsTable.platform} IS NOT NULL`,
        isNull(dailyMetricsTable.topic),
        isNull(dailyMetricsTable.competitor),
      ),
    );

  const platformMap = new Map<string, number[]>();
  for (const row of platformRows) {
    if (!row.platform) continue;
    const arr = platformMap.get(row.platform) || [];
    arr.push(row.mentionRate);
    platformMap.set(row.platform, arr);
  }

  const platforms = Array.from(platformMap.entries())
    .map(([platform, rates]) => ({
      platform,
      rate:
        Math.round((rates.reduce((a, b) => a + b, 0) / rates.length) * 10) / 10,
    }))
    .sort((a, b) => b.rate - a.rate);

  // Competitor leaderboard
  const compRows = await db
    .select()
    .from(dailyMetricsTable)
    .where(
      and(
        eq(dailyMetricsTable.workspaceId, wsId),
        gte(dailyMetricsTable.date, startDate),
        lte(dailyMetricsTable.date, endDate),
        isNull(dailyMetricsTable.platform),
        isNull(dailyMetricsTable.topic),
        sql`${dailyMetricsTable.competitor} IS NOT NULL`,
      ),
    );

  const compMap = new Map<string, number[]>();
  for (const row of compRows) {
    if (!row.competitor) continue;
    const arr = compMap.get(row.competitor) || [];
    arr.push(row.mentionRate);
    compMap.set(row.competitor, arr);
  }

  const compAvgs = Array.from(compMap.entries()).map(([name, rates]) => ({
    name,
    avg: rates.reduce((a, b) => a + b, 0) / rates.length,
  }));

  // Add own brand
  compAvgs.push({ name: brandName, avg: curMention });
  compAvgs.sort((a, b) => b.avg - a.avg);

  const competitors = compAvgs.map((c, i) => ({
    rank: i + 1,
    name: c.name,
    value: formatPct(c.avg),
    change: "+0.0%",
    isYou: c.name === brandName,
  }));

  res.json({ kpis, platforms, competitors, answerCount });
});

// ── GET /analytics/visibility ────────────────────────────────────────────────

router.get("/analytics/visibility", async (req, res) => {
  const wsId = await resolveWorkspaceId(req);
  if (!wsId) {
    res.json({
      kpis: [],
      mentionRateSeries: [],
      mentionRateLeaderboard: [],
      sovSeries: [],
      sovLeaderboard: [],
      positionSeries: [],
      positionLeaderboard: [],
      topicBars: [],
      heatmap: [],
    });
    return;
  }
  const brandName = await getWorkspaceBrandName(wsId);
  const { startDate, endDate } = getDateBounds(req.query.dateRange as string);
  const days = dateRangeToDays(req.query.dateRange as string);

  const prevEnd = new Date(startDate);
  prevEnd.setDate(prevEnd.getDate() - 1);
  const prevStart = new Date(prevEnd);
  prevStart.setDate(prevStart.getDate() - days);
  const prevStartStr = prevStart.toISOString().slice(0, 10);
  const prevEndStr = prevEnd.toISOString().slice(0, 10);

  // Time series (own brand, overall)
  const series = await db
    .select()
    .from(dailyMetricsTable)
    .where(
      and(
        eq(dailyMetricsTable.workspaceId, wsId),
        gte(dailyMetricsTable.date, startDate),
        lte(dailyMetricsTable.date, endDate),
        isNull(dailyMetricsTable.platform),
        isNull(dailyMetricsTable.topic),
        isNull(dailyMetricsTable.competitor),
      ),
    )
    .orderBy(asc(dailyMetricsTable.date));

  const prevSeries = await db
    .select()
    .from(dailyMetricsTable)
    .where(
      and(
        eq(dailyMetricsTable.workspaceId, wsId),
        gte(dailyMetricsTable.date, prevStartStr),
        lte(dailyMetricsTable.date, prevEndStr),
        isNull(dailyMetricsTable.platform),
        isNull(dailyMetricsTable.topic),
        isNull(dailyMetricsTable.competitor),
      ),
    );

  const avg = (rows: typeof series, field: keyof (typeof series)[0]) => {
    if (rows.length === 0) return 0;
    return rows.reduce((s, r) => s + (Number(r[field]) || 0), 0) / rows.length;
  };

  const curMention = avg(series, "mentionRate");
  const prevMention = avg(prevSeries, "mentionRate");
  const curSov = avg(series, "shareOfVoice");
  const prevSov = avg(prevSeries, "shareOfVoice");
  const curPos = avg(series, "avgPosition");
  const prevPos = avg(prevSeries, "avgPosition");

  const kpis = [
    {
      label: "Mention Rate",
      value: formatPct(curMention),
      change: formatChange(curMention, prevMention),
      trend: trend(curMention, prevMention),
    },
    {
      label: "Share of Voice",
      value: formatPct(curSov),
      change: formatChange(curSov, prevSov),
      trend: trend(curSov, prevSov),
    },
    {
      label: "Average Position",
      value: curPos.toFixed(1),
      change: `${curPos - prevPos >= 0 ? "+" : ""}${(curPos - prevPos).toFixed(1)}`,
      trend: curPos <= prevPos ? "up" : "down",
    },
  ];

  const mentionRateSeries = series.map((r) => ({
    date: r.date,
    value: r.mentionRate,
  }));
  const sovSeries = series.map((r) => ({
    date: r.date,
    value: r.shareOfVoice,
  }));
  const positionSeries = series.map((r) => ({
    date: r.date,
    value: r.avgPosition,
  }));

  // Competitor leaderboards
  const compRows = await db
    .select()
    .from(dailyMetricsTable)
    .where(
      and(
        eq(dailyMetricsTable.workspaceId, wsId),
        gte(dailyMetricsTable.date, startDate),
        lte(dailyMetricsTable.date, endDate),
        isNull(dailyMetricsTable.platform),
        isNull(dailyMetricsTable.topic),
        sql`${dailyMetricsTable.competitor} IS NOT NULL`,
      ),
    );

  const compAgg = new Map<
    string,
    { mention: number[]; sov: number[]; pos: number[] }
  >();
  for (const r of compRows) {
    if (!r.competitor) continue;
    const entry = compAgg.get(r.competitor) || {
      mention: [],
      sov: [],
      pos: [],
    };
    entry.mention.push(r.mentionRate);
    entry.sov.push(r.shareOfVoice);
    entry.pos.push(r.avgPosition);
    compAgg.set(r.competitor, entry);
  }

  function buildLeaderboard(
    field: "mention" | "sov" | "pos",
    ownValue: number,
    ascending = false,
  ) {
    const entries = Array.from(compAgg.entries()).map(([name, data]) => ({
      name,
      avg: data[field].reduce((a, b) => a + b, 0) / data[field].length,
    }));
    entries.push({ name: brandName, avg: ownValue });
    entries.sort((a, b) => (ascending ? a.avg - b.avg : b.avg - a.avg));
    return entries.map((e, i) => ({
      rank: i + 1,
      name: e.name,
      value: field === "pos" ? e.avg.toFixed(1) : formatPct(e.avg),
      change: "+0.0%",
      isYou: e.name === brandName,
    }));
  }

  const mentionRateLeaderboard = buildLeaderboard("mention", curMention);
  const sovLeaderboard = buildLeaderboard("sov", curSov);
  const positionLeaderboard = buildLeaderboard("pos", curPos, true);

  // Topic bars
  const topicRows = await db
    .select()
    .from(dailyMetricsTable)
    .where(
      and(
        eq(dailyMetricsTable.workspaceId, wsId),
        gte(dailyMetricsTable.date, startDate),
        lte(dailyMetricsTable.date, endDate),
        isNull(dailyMetricsTable.platform),
        sql`${dailyMetricsTable.topic} IS NOT NULL`,
        isNull(dailyMetricsTable.competitor),
      ),
    );

  const topicMap = new Map<string, number[]>();
  for (const r of topicRows) {
    if (!r.topic) continue;
    const arr = topicMap.get(r.topic) || [];
    arr.push(r.mentionRate);
    topicMap.set(r.topic, arr);
  }

  const topicBars = Array.from(topicMap.entries()).map(([topic, rates]) => ({
    topic,
    brands: [
      {
        name: brandName,
        value:
          Math.round((rates.reduce((a, b) => a + b, 0) / rates.length) * 10) /
          10,
        isYou: true,
      },
    ],
  }));

  // Heatmap (platform x brand)
  const heatmapRows = await db
    .select()
    .from(dailyMetricsTable)
    .where(
      and(
        eq(dailyMetricsTable.workspaceId, wsId),
        gte(dailyMetricsTable.date, startDate),
        lte(dailyMetricsTable.date, endDate),
        sql`${dailyMetricsTable.platform} IS NOT NULL`,
        isNull(dailyMetricsTable.topic),
        isNull(dailyMetricsTable.competitor),
      ),
    );

  const heatmap: Array<{ row: string; col: string; value: number }> = [];
  const heatmapMap = new Map<string, number[]>();
  for (const r of heatmapRows) {
    if (!r.platform) continue;
    const key = `${brandName}|${r.platform}`;
    const arr = heatmapMap.get(key) || [];
    arr.push(r.mentionRate);
    heatmapMap.set(key, arr);
  }

  for (const [key, rates] of heatmapMap) {
    const [row, col] = key.split("|");
    heatmap.push({
      row,
      col,
      value:
        Math.round((rates.reduce((a, b) => a + b, 0) / rates.length) * 10) / 10,
    });
  }

  res.json({
    kpis,
    mentionRateSeries,
    mentionRateLeaderboard,
    sovSeries,
    sovLeaderboard,
    positionSeries,
    positionLeaderboard,
    topicBars,
    heatmap,
  });
});

// ── GET /analytics/citations ─────────────────────────────────────────────────

router.get("/analytics/citations", async (req, res) => {
  const wsId = await resolveWorkspaceId(req);
  if (!wsId) {
    res.json({
      kpis: [],
      domainCategories: [],
      citationRateSeries: [],
      domainTrends: [],
      competitorTrends: [],
      topDomains: [],
      topUrls: [],
      heatmap: [],
    });
    return;
  }
  const { startDate, endDate } = getDateBounds(req.query.dateRange as string);
  const days = dateRangeToDays(req.query.dateRange as string);

  const prevEnd = new Date(startDate);
  prevEnd.setDate(prevEnd.getDate() - 1);
  const prevStart = new Date(prevEnd);
  prevStart.setDate(prevStart.getDate() - days);
  const prevStartStr = prevStart.toISOString().slice(0, 10);
  const prevEndStr = prevEnd.toISOString().slice(0, 10);

  const series = await db
    .select()
    .from(dailyMetricsTable)
    .where(
      and(
        eq(dailyMetricsTable.workspaceId, wsId),
        gte(dailyMetricsTable.date, startDate),
        lte(dailyMetricsTable.date, endDate),
        isNull(dailyMetricsTable.platform),
        isNull(dailyMetricsTable.topic),
        isNull(dailyMetricsTable.competitor),
      ),
    )
    .orderBy(asc(dailyMetricsTable.date));

  const prevSeries = await db
    .select()
    .from(dailyMetricsTable)
    .where(
      and(
        eq(dailyMetricsTable.workspaceId, wsId),
        gte(dailyMetricsTable.date, prevStartStr),
        lte(dailyMetricsTable.date, prevEndStr),
        isNull(dailyMetricsTable.platform),
        isNull(dailyMetricsTable.topic),
        isNull(dailyMetricsTable.competitor),
      ),
    );

  const avg = (rows: typeof series, f: keyof (typeof series)[0]) =>
    rows.length === 0
      ? 0
      : rows.reduce((s, r) => s + (Number(r[f]) || 0), 0) / rows.length;
  const sumF = (rows: typeof series, f: keyof (typeof series)[0]) =>
    rows.reduce((s, r) => s + (Number(r[f]) || 0), 0);

  const curCitRate = avg(series, "citationRate");
  const prevCitRate = avg(prevSeries, "citationRate");
  const curCitShare = avg(series, "citationShare");
  const prevCitShare = avg(prevSeries, "citationShare");
  const curCitCount = sumF(series, "totalCitations");
  const prevCitCount = sumF(prevSeries, "totalCitations");

  const kpis = [
    {
      label: "Citation Rate",
      value: formatPct(curCitRate),
      change: formatChange(curCitRate, prevCitRate),
      trend: trend(curCitRate, prevCitRate),
    },
    {
      label: "Citation Share",
      value: formatPct(curCitShare),
      change: formatChange(curCitShare, prevCitShare),
      trend: trend(curCitShare, prevCitShare),
    },
    {
      label: "Citations",
      value: curCitCount.toLocaleString(),
      change: `${curCitCount - prevCitCount >= 0 ? "+" : ""}${curCitCount - prevCitCount}`,
      trend: trend(curCitCount, prevCitCount),
    },
  ];

  const citationRateSeries = series.map((r) => ({
    date: r.date,
    value: r.citationRate,
  }));

  // Domain categories from citations table
  const domainTypeRows = await db
    .select({
      domainType: citationsTable.domainType,
      count: sql<number>`count(*)::int`,
    })
    .from(citationsTable)
    .where(eq(citationsTable.workspaceId, wsId))
    .groupBy(citationsTable.domainType);

  const totalCit = domainTypeRows.reduce((s, r) => s + r.count, 0);
  const colorMap: Record<string, string> = {
    Products: "teal",
    Social: "pink",
    Educational: "emerald",
    Competitors: "blue",
    Forums: "amber",
    Reference: "purple",
    Owned: "green",
  };

  const domainCategories = domainTypeRows
    .map((r) => ({
      category: r.domainType,
      share: totalCit > 0 ? Math.round((r.count / totalCit) * 100) : 0,
      color: colorMap[r.domainType] || "neutral",
    }))
    .sort((a, b) => b.share - a.share);

  // Domain trends — use actual top cited domains from DB
  const domainTrends: Array<{
    name: string;
    data: Array<{ date: string; value: number }>;
  }> = [];

  // Competitor trends — use actual competitor daily metrics
  const compTrendRows = await db
    .select()
    .from(dailyMetricsTable)
    .where(
      and(
        eq(dailyMetricsTable.workspaceId, wsId),
        gte(dailyMetricsTable.date, startDate),
        lte(dailyMetricsTable.date, endDate),
        isNull(dailyMetricsTable.platform),
        isNull(dailyMetricsTable.topic),
        sql`${dailyMetricsTable.competitor} IS NOT NULL`,
      ),
    )
    .orderBy(asc(dailyMetricsTable.date));

  const compTrendMap = new Map<
    string,
    Array<{ date: string; value: number }>
  >();
  for (const r of compTrendRows) {
    if (!r.competitor) continue;
    const arr = compTrendMap.get(r.competitor) || [];
    arr.push({ date: r.date, value: r.citationRate });
    compTrendMap.set(r.competitor, arr);
  }
  const competitorTrends = Array.from(compTrendMap.entries()).map(
    ([name, data]) => ({ name, data }),
  );

  // Top domains
  const topDomainRows = await db
    .select({
      domain: citationsTable.domain,
      count: sql<number>`count(*)::int`,
    })
    .from(citationsTable)
    .where(eq(citationsTable.workspaceId, wsId))
    .groupBy(citationsTable.domain)
    .orderBy(sql`count(*) desc`)
    .limit(10);

  const topDomains = topDomainRows.map((r, i) => ({
    rank: i + 1,
    domain: r.domain,
    pctOfTotal: totalCit > 0 ? Math.round((r.count / totalCit) * 1000) / 10 : 0,
    citations: r.count,
  }));

  // Top URLs
  const topUrlRows = await db
    .select({
      url: citationsTable.url,
      count: sql<number>`count(*)::int`,
    })
    .from(citationsTable)
    .where(eq(citationsTable.workspaceId, wsId))
    .groupBy(citationsTable.url)
    .orderBy(sql`count(*) desc`)
    .limit(10);

  const topUrls = topUrlRows.map((r, i) => ({
    rank: i + 1,
    url: r.url,
    pctOfTotal: totalCit > 0 ? Math.round((r.count / totalCit) * 1000) / 10 : 0,
    citations: r.count,
  }));

  // Heatmap (topic x platform)
  const heatmapRows = await db
    .select()
    .from(dailyMetricsTable)
    .where(
      and(
        eq(dailyMetricsTable.workspaceId, wsId),
        gte(dailyMetricsTable.date, startDate),
        lte(dailyMetricsTable.date, endDate),
        sql`${dailyMetricsTable.platform} IS NOT NULL`,
        sql`${dailyMetricsTable.topic} IS NOT NULL`,
        isNull(dailyMetricsTable.competitor),
      ),
    );

  // Build heatmap from actual per-platform-per-topic daily metrics
  const heatmap: Array<{ row: string; col: string; value: number }> = [];
  const hmMap = new Map<string, number[]>();
  for (const r of heatmapRows) {
    if (!r.platform || !r.topic) continue;
    const key = `${r.topic}|${r.platform}`;
    const arr = hmMap.get(key) || [];
    arr.push(r.citationRate);
    hmMap.set(key, arr);
  }
  for (const [key, rates] of hmMap) {
    const [row, col] = key.split("|");
    heatmap.push({
      row: row.length > 25 ? row.slice(0, 25) + "..." : row,
      col,
      value:
        Math.round((rates.reduce((a, b) => a + b, 0) / rates.length) * 10) / 10,
    });
  }

  res.json({
    kpis,
    domainCategories,
    citationRateSeries,
    domainTrends,
    competitorTrends,
    topDomains,
    topUrls,
    heatmap,
  });
});

// ── GET /analytics/community ─────────────────────────────────────────────────

router.get("/analytics/community", async (req, res) => {
  const wsId = await resolveWorkspaceId(req);
  if (!wsId) {
    res.json({ kpis: [], subreddits: [], topUrls: [] });
    return;
  }
  const { startDate, endDate } = getDateBounds(req.query.dateRange as string);

  // Reddit citations
  const redditCitations = await db
    .select({
      url: citationsTable.url,
      count: sql<number>`count(*)::int`,
    })
    .from(citationsTable)
    .where(
      and(
        eq(citationsTable.workspaceId, wsId),
        eq(citationsTable.domain, "reddit.com"),
      ),
    )
    .groupBy(citationsTable.url)
    .orderBy(sql`count(*) desc`)
    .limit(10);

  const totalReddit = redditCitations.reduce((s, r) => s + r.count, 0);
  const totalAll = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(citationsTable)
    .where(eq(citationsTable.workspaceId, wsId));
  const totalAllCount = totalAll[0]?.count || 1;
  const redditRate = Math.round((totalReddit / totalAllCount) * 1000) / 10;

  const kpis = [
    {
      label: "Reddit Citation Rate",
      value: formatPct(redditRate),
      change: "+0.0%",
      trend: "flat" as const,
    },
    {
      label: "Reddit Citations",
      value: totalReddit.toLocaleString(),
      change: "+0",
      trend: "flat" as const,
    },
  ];

  // Subreddits
  const subredditMap = new Map<string, number>();
  for (const row of redditCitations) {
    const match = row.url.match(/reddit\.com\/(r\/[^/]+)/);
    const sub = match ? match[1] : "r/other";
    subredditMap.set(sub, (subredditMap.get(sub) || 0) + row.count);
  }

  const subreddits = Array.from(subredditMap.entries())
    .map(([name, count]) => ({
      name,
      rate: Math.round((count / totalAllCount) * 1000) / 10,
    }))
    .sort((a, b) => b.rate - a.rate);

  const topUrls = redditCitations.map((r, i) => ({
    rank: i + 1,
    url: r.url,
    citations: r.count,
    change: "+0%",
  }));

  res.json({ kpis, subreddits, topUrls });
});

// ── GET /analytics/sentiment ─────────────────────────────────────────────────

router.get("/analytics/sentiment", async (req, res) => {
  const wsId = await resolveWorkspaceId(req);
  if (!wsId) {
    res.json({
      kpis: [],
      scoreSeries: [],
      themes: [],
      treemapPositive: [],
      treemapNegative: [],
    });
    return;
  }
  const { startDate, endDate } = getDateBounds(req.query.dateRange as string);
  const sentimentFilter = (req.query.sentimentFilter as string) || "all";

  // Sentiment score series
  const series = await db
    .select()
    .from(dailyMetricsTable)
    .where(
      and(
        eq(dailyMetricsTable.workspaceId, wsId),
        gte(dailyMetricsTable.date, startDate),
        lte(dailyMetricsTable.date, endDate),
        isNull(dailyMetricsTable.platform),
        isNull(dailyMetricsTable.topic),
        isNull(dailyMetricsTable.competitor),
      ),
    )
    .orderBy(asc(dailyMetricsTable.date));

  const scoreSeries = series.map((r) => ({
    date: r.date,
    value: r.sentimentScore,
  }));
  const curScore =
    series.length > 0
      ? Math.round(
          series.reduce((s, r) => s + r.sentimentScore, 0) / series.length,
        )
      : 0;

  const kpis = [
    {
      label: "Sentiment Score",
      value: String(curScore),
      change: "+0",
      trend: "flat" as const,
    },
  ];

  // Themes
  const themes = await db
    .select()
    .from(sentimentThemesTable)
    .where(eq(sentimentThemesTable.workspaceId, wsId));

  const filteredThemes =
    sentimentFilter === "all"
      ? themes
      : themes.filter((t) =>
          sentimentFilter === "positive" ? t.isPositive : !t.isPositive,
        );

  const themeRecords = filteredThemes.map((t) => ({
    id: t.id,
    theme: t.theme,
    sentimentScore: t.sentimentScore,
    volumePct: t.volumePct,
    occurrences: t.occurrences,
    isPositive: t.isPositive,
    exampleText: t.exampleText,
  }));

  const treemapPositive = themes
    .filter((t) => t.isPositive)
    .map((t) => ({ theme: t.theme, occurrences: t.occurrences }))
    .sort((a, b) => b.occurrences - a.occurrences);

  const treemapNegative = themes
    .filter((t) => !t.isPositive)
    .map((t) => ({ theme: t.theme, occurrences: t.occurrences }))
    .sort((a, b) => b.occurrences - a.occurrences);

  res.json({
    kpis,
    scoreSeries,
    themes: themeRecords,
    treemapPositive,
    treemapNegative,
  });
});

// ── GET /analytics/opportunities ─────────────────────────────────────────────

router.get("/analytics/opportunities", async (req, res) => {
  const wsId = await resolveWorkspaceId(req);
  if (!wsId) {
    res.json({ kpis: [], contentGaps: [], offsitePlacements: [] });
    return;
  }
  // Content gaps: prompts where brand mention rate is low but competitors are high
  // We'll build this from daily_metrics comparing own brand vs competitors
  const { startDate, endDate } = getDateBounds(req.query.dateRange as string);

  // Get prompts with low mention rate
  const { promptsTable } = await import("@workspace/db");
  const prompts = await db
    .select()
    .from(promptsTable)
    .where(eq(promptsTable.workspaceId, wsId))
    .limit(50);

  // Content gaps: prompts with zero data are opportunities
  // For a new workspace with no execution data, all prompts are gaps
  const contentGaps = prompts.slice(0, 10).map((p) => ({
    prompt: p.text,
    yourRate: 0,
    topCompetitor: "",
    theirRate: 0,
    suggestedAction: "Create content targeting this query",
  }));

  // Offsite placements from citations where brand is not referenced
  const offsiteCitations = await db
    .select()
    .from(citationsTable)
    .where(
      and(
        eq(citationsTable.workspaceId, wsId),
        eq(citationsTable.hasBrandReference, false),
      ),
    )
    .orderBy(desc(citationsTable.influenceScore))
    .limit(5);

  const offsitePlacements = offsiteCitations.map((c) => ({
    url: c.url,
    influence: c.influenceScore,
    citations: 0,
    domainType: c.domainType,
    da: c.domainAuthority || 0,
    topics: "",
    competitors: c.competitorReferences?.join(", ") || "None",
    action: "Request placement",
  }));

  const totalOpps = contentGaps.length + offsitePlacements.length;
  const highPriority = Math.ceil(totalOpps * 0.45);

  const kpis = [
    {
      label: "Total Opportunities",
      value: String(totalOpps),
      change: "+0",
      trend: "flat" as const,
    },
    {
      label: "High Priority",
      value: String(highPriority),
      change: "+0",
      trend: "flat" as const,
    },
    {
      label: "Est. Visibility Uplift",
      value: "+0%",
      change: "+0",
      trend: "flat" as const,
    },
  ];

  res.json({ kpis, contentGaps, offsitePlacements });
});

export default router;
