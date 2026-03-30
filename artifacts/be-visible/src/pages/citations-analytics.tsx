import {
  Info,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Loader2,
} from "lucide-react";
import { useGetCitationsAnalytics } from "@workspace/api-client-react";
import { useGlobalFilters } from "@/hooks/use-global-filters";
import type { NamedTimeSeries } from "@workspace/api-client-react";

function getHeatColor(val: number): string {
  if (val > 30) return "bg-primary text-primary-foreground";
  if (val > 20) return "bg-primary/60 text-white";
  if (val > 10) return "bg-primary/30 text-foreground";
  if (val > 5) return "bg-primary/15 text-foreground";
  return "bg-primary/5 text-muted-foreground";
}

const TREND_COLORS = [
  "text-emerald-500",
  "text-blue-500",
  "text-purple-500",
  "text-red-500",
  "text-orange-500",
  "text-amber-500",
  "text-pink-500",
  "text-cyan-500",
];

const DOT_COLORS = [
  "bg-emerald-500",
  "bg-blue-500",
  "bg-purple-500",
  "bg-red-500",
  "bg-orange-500",
  "bg-amber-500",
  "bg-pink-500",
  "bg-cyan-500",
];

function MiniSparkline({
  series,
  colorClass,
}: {
  series: NamedTimeSeries;
  colorClass: string;
}) {
  const points = series.data;
  if (!points.length) return null;

  const values = points.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const width = 96;
  const height = 24;
  const padding = 2;

  const polyPoints = points
    .map((p, i) => {
      const x =
        padding + (i / Math.max(points.length - 1, 1)) * (width - padding * 2);
      const y =
        height - padding - ((p.value - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="shrink-0"
    >
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={colorClass}
        points={polyPoints}
      />
    </svg>
  );
}

export default function CitationsAnalyticsPage() {
  const { filterParams } = useGlobalFilters();
  const { data, isLoading, isError } = useGetCitationsAnalytics(filterParams);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const citationRateSeries = data?.citationRateSeries ?? [];
  const citationRateValues = citationRateSeries.map((p) => p.value);
  const minRate = Math.min(...citationRateValues, 0) - 2;
  const maxRate = Math.max(...citationRateValues, 0) + 2;
  const range = maxRate - minRate;

  // Derive unique rows/cols for heatmap
  const heatmapData = data?.heatmap ?? [];
  const heatmapRows = [...new Set(heatmapData.map((c) => c.row))];
  const heatmapCols = [...new Set(heatmapData.map((c) => c.col))];
  const heatmapLookup = new Map(
    heatmapData.map((c) => [`${c.row}|${c.col}`, c.value]),
  );

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">
          Citations Analytics
        </h1>
        <p className="text-sm text-muted-foreground">
          Which URLs and domains are being cited by AI engines.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(data?.kpis ?? []).map((card) => (
          <div
            key={card.label}
            className="bg-surface-container-lowest p-5 rounded-xl ring-1 ring-black/[0.03]"
          >
            <div className="flex items-center gap-1.5 mb-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {card.label}
              </span>
              <Info className="w-3 h-3 text-muted-foreground/50" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight">
                {card.value}
              </span>
              <span
                className={`text-xs font-bold flex items-center gap-1 ${
                  card.trend === "up"
                    ? "text-emerald-600"
                    : card.trend === "down"
                      ? "text-red-500"
                      : "text-muted-foreground"
                }`}
              >
                {card.trend === "up" ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : card.trend === "down" ? (
                  <TrendingDown className="w-3.5 h-3.5" />
                ) : null}{" "}
                {card.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Domain Category Breakdown */}
      <div className="bg-surface-container-lowest p-6 rounded-xl ring-1 ring-black/[0.03]">
        <h3 className="text-sm font-bold mb-4">Domain Category Breakdown</h3>
        <div className="flex rounded-full overflow-hidden h-6">
          {(data?.domainCategories ?? []).map((cat) => (
            <div
              key={cat.category}
              className={`${cat.color} flex items-center justify-center`}
              style={{ width: `${cat.share}%` }}
              title={`${cat.category}: ${cat.share}%`}
            >
              {cat.share > 6 && (
                <span className="text-[9px] text-white font-bold">
                  {cat.category} {cat.share}%
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-4 mt-3">
          {(data?.domainCategories ?? []).map((cat) => (
            <div key={cat.category} className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${cat.color}`} />
              <span className="text-[10px] text-muted-foreground">
                {cat.category} ({cat.share}%)
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Citation Rate Time Series + Domain/Competitor Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Citation Rate Over Time */}
        <div className="bg-surface-container-lowest p-6 rounded-xl ring-1 ring-black/[0.03]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold">Citation Rate Over Time</h3>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border/60 rounded-lg">
              Overall <ChevronDown className="w-3 h-3" />
            </button>
          </div>
          <div className="relative h-36">
            <svg
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="none"
            >
              <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-primary"
                points={citationRateValues
                  .map(
                    (v, i) =>
                      `${(i / (citationRateValues.length - 1)) * 100}%,${100 - ((v - minRate) / range) * 100}%`,
                  )
                  .join(" ")}
              />
              {citationRateValues.map((v, i) => (
                <circle
                  key={i}
                  cx={`${(i / (citationRateValues.length - 1)) * 100}%`}
                  cy={`${100 - ((v - minRate) / range) * 100}%`}
                  r="3.5"
                  className="fill-primary"
                />
              ))}
            </svg>
          </div>
          <div className="flex justify-between mt-2 font-mono text-[10px] text-muted-foreground">
            {citationRateSeries.map((p) => (
              <span key={p.date}>{p.date}</span>
            ))}
          </div>
        </div>

        {/* Citation Rate by Domain */}
        <div className="bg-surface-container-lowest p-6 rounded-xl ring-1 ring-black/[0.03]">
          <h3 className="text-sm font-bold mb-4">Citation Rate by Domain</h3>
          <div className="space-y-3">
            {(data?.domainTrends ?? []).map((series, idx) => (
              <div key={series.name} className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${DOT_COLORS[idx % DOT_COLORS.length]} shrink-0`}
                />
                <span className="text-xs font-medium flex-1">
                  {series.name}
                </span>
                <MiniSparkline
                  series={series}
                  colorClass={TREND_COLORS[idx % TREND_COLORS.length]}
                />
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-border/20">
            <h4 className="text-xs font-bold mb-3">
              Citation Rate by Competitors
            </h4>
            <div className="space-y-3">
              {(data?.competitorTrends ?? []).map((series, idx) => (
                <div key={series.name} className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${DOT_COLORS[idx % DOT_COLORS.length]} shrink-0`}
                  />
                  <span className="text-xs font-medium flex-1">
                    {series.name}
                  </span>
                  <MiniSparkline
                    series={series}
                    colorClass={TREND_COLORS[idx % TREND_COLORS.length]}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Domains + Top URLs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest rounded-xl ring-1 ring-black/[0.03] overflow-hidden">
          <div className="p-4 border-b border-border/20">
            <h3 className="text-sm font-bold">Top 10 Cited Domains</h3>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border/20">
                <th className="py-2 px-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-normal w-8">
                  #
                </th>
                <th className="py-2 px-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-normal">
                  Domain
                </th>
                <th className="py-2 px-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-normal">
                  % of Total
                </th>
                <th className="py-2 px-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-normal">
                  Citations
                </th>
              </tr>
            </thead>
            <tbody>
              {(data?.topDomains ?? []).map((d) => (
                <tr
                  key={d.rank}
                  className="border-b border-border/10 hover:bg-surface-container-low/30"
                >
                  <td className="py-2.5 px-4 font-mono text-xs text-muted-foreground">
                    {d.rank}
                  </td>
                  <td className="py-2.5 px-4 text-sm font-medium">
                    {d.domain}
                  </td>
                  <td className="py-2.5 px-4 font-mono text-xs">
                    {d.pctOfTotal}%
                  </td>
                  <td className="py-2.5 px-4 font-mono text-xs">
                    {d.citations.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-surface-container-lowest rounded-xl ring-1 ring-black/[0.03] overflow-hidden">
          <div className="p-4 border-b border-border/20">
            <h3 className="text-sm font-bold">Top 10 Cited URLs</h3>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border/20">
                <th className="py-2 px-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-normal w-8">
                  #
                </th>
                <th className="py-2 px-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-normal">
                  URL
                </th>
                <th className="py-2 px-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-normal">
                  %
                </th>
                <th className="py-2 px-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-normal">
                  Citations
                </th>
              </tr>
            </thead>
            <tbody>
              {(data?.topUrls ?? []).map((u) => (
                <tr
                  key={u.rank}
                  className="border-b border-border/10 hover:bg-surface-container-low/30"
                >
                  <td className="py-2.5 px-4 font-mono text-xs text-muted-foreground">
                    {u.rank}
                  </td>
                  <td
                    className="py-2.5 px-4 text-xs font-medium truncate max-w-[200px]"
                    title={u.url}
                  >
                    {u.url}
                  </td>
                  <td className="py-2.5 px-4 font-mono text-xs">
                    {u.pctOfTotal}%
                  </td>
                  <td className="py-2.5 px-4 font-mono text-xs">
                    {u.citations.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Topic Citation Heatmap */}
      <div className="bg-surface-container-lowest p-6 rounded-xl ring-1 ring-black/[0.03]">
        <h3 className="text-sm font-bold mb-6">
          Topic Citation Rate by Platform
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="py-2 px-3 text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-normal min-w-[200px]">
                  Topic
                </th>
                {heatmapCols.map((col) => (
                  <th
                    key={col}
                    className="py-2 px-3 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-normal"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heatmapRows.map((row) => (
                <tr key={row}>
                  <td className="py-2 px-3 text-xs font-medium">{row}</td>
                  {heatmapCols.map((col) => {
                    const val = heatmapLookup.get(`${row}|${col}`) ?? 0;
                    return (
                      <td key={col} className="py-2 px-3 text-center">
                        <span
                          className={`inline-block w-full py-2 rounded font-mono text-xs font-bold ${getHeatColor(val)}`}
                        >
                          {val}%
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
