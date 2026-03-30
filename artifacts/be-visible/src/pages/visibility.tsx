import {
  Info,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Loader2,
} from "lucide-react";
import { useGetVisibility } from "@workspace/api-client-react";
import { useGlobalFilters } from "@/hooks/use-global-filters";
import type {
  TimeSeriesPoint,
  CompetitorRank,
} from "@workspace/api-client-react";

function SparklineChart({
  data,
  minVal,
  maxVal,
}: {
  data: number[];
  minVal: number;
  maxVal: number;
}) {
  const range = maxVal - minVal;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - ((v - minVal) / range) * 100;
      return `${x}%,${y}%`;
    })
    .join(" ");

  return (
    <div className="relative h-40 mt-4">
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
      >
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-primary"
          points={points}
        />
        {data.map((v, i) => (
          <circle
            key={i}
            cx={`${(i / (data.length - 1)) * 100}%`}
            cy={`${100 - ((v - minVal) / range) * 100}%`}
            r="3.5"
            className="fill-primary"
          />
        ))}
      </svg>
      {data.map((v, i) => (
        <span
          key={i}
          className="absolute font-mono text-[9px] text-muted-foreground -translate-x-1/2"
          style={{
            left: `${(i / (data.length - 1)) * 100}%`,
            top: `${100 - ((v - minVal) / range) * 100 - 8}%`,
          }}
        >
          {v}
        </span>
      ))}
    </div>
  );
}

function CompetitorLeaderboard({
  title,
  data,
}: {
  title: string;
  data: CompetitorRank[];
}) {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl ring-1 ring-black/[0.03]">
      <h4 className="text-sm font-bold mb-4">{title}</h4>
      <div className="space-y-0">
        {data.map((c) => {
          const positive =
            c.change.startsWith("+") || c.change.startsWith("-0");
          return (
            <div
              key={c.name}
              className={`flex items-center gap-3 py-2.5 px-3 rounded-lg ${c.isYou ? "bg-primary/5" : ""}`}
            >
              <span className="font-mono text-xs text-muted-foreground w-4">
                {c.rank}
              </span>
              <span className="text-sm font-medium flex-1">
                {c.name}
                {c.isYou && (
                  <span className="ml-2 text-[10px] font-bold bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
                    You
                  </span>
                )}
              </span>
              <span className="font-mono text-sm font-bold">{c.value}</span>
              <span
                className={`font-mono text-[11px] w-12 text-right ${positive ? "text-emerald-600" : "text-destructive"}`}
              >
                {c.change}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getHeatmapColor(val: number): string {
  if (val > 15) return "bg-primary text-primary-foreground";
  if (val > 8) return "bg-primary/60 text-white";
  if (val > 4) return "bg-primary/30 text-foreground";
  if (val > 1) return "bg-primary/15 text-foreground";
  return "bg-primary/5 text-muted-foreground";
}

function seriesValues(series: TimeSeriesPoint[]): number[] {
  return series.map((p) => p.value);
}

function seriesDateLabels(series: TimeSeriesPoint[]): string[] {
  return series.map((p) => {
    const d = new Date(p.date);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  });
}

function seriesRange(values: number[], padding = 0.2) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  return { minVal: min - range * padding, maxVal: max + range * padding };
}

export default function VisibilityPage() {
  const { filterParams } = useGlobalFilters();
  const { data, isLoading, isError } = useGetVisibility(filterParams);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const mentionValues = seriesValues(data?.mentionRateSeries ?? []);
  const mentionDates = seriesDateLabels(data?.mentionRateSeries ?? []);
  const mentionRange = seriesRange(mentionValues);

  const sovValues = seriesValues(data?.sovSeries ?? []);
  const sovDates = seriesDateLabels(data?.sovSeries ?? []);
  const sovRange = seriesRange(sovValues);

  const positionValues = seriesValues(data?.positionSeries ?? []);
  const positionDates = seriesDateLabels(data?.positionSeries ?? []);
  const positionRange = seriesRange(positionValues);

  // Build heatmap grid from flat cells
  const heatmapRows = [...new Set((data?.heatmap ?? []).map((c) => c.row))];
  const heatmapCols = [...new Set((data?.heatmap ?? []).map((c) => c.col))];
  const heatmapLookup = new Map(
    (data?.heatmap ?? []).map((c) => [`${c.row}::${c.col}`, c.value]),
  );

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">Visibility</h1>
        <p className="text-sm text-muted-foreground">
          Deep dive into brand visibility metrics over time, across platforms,
          topics, and competitors.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(data?.kpis ?? []).map((card) => {
          const positive = card.trend === "up";
          return (
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
                  className={`text-xs font-bold flex items-center gap-1 ${positive ? "text-emerald-600" : "text-destructive"}`}
                >
                  {positive ? (
                    <TrendingUp className="w-3.5 h-3.5" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5" />
                  )}
                  {card.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mention Rate Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-xl ring-1 ring-black/[0.03]">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold">Mention Rate</h3>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border/60 rounded-lg">
              Overall <ChevronDown className="w-3 h-3" />
            </button>
          </div>
          <SparklineChart
            data={mentionValues}
            minVal={mentionRange.minVal}
            maxVal={mentionRange.maxVal}
          />
          <div className="flex justify-between mt-2 font-mono text-[10px] text-muted-foreground">
            {mentionDates.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
        </div>
        <CompetitorLeaderboard
          title="Mention Rate by Competitor"
          data={data?.mentionRateLeaderboard ?? []}
        />
      </div>

      {/* Share of Voice Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-xl ring-1 ring-black/[0.03]">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold">Share of Voice</h3>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border/60 rounded-lg">
              Overall <ChevronDown className="w-3 h-3" />
            </button>
          </div>
          <SparklineChart
            data={sovValues}
            minVal={sovRange.minVal}
            maxVal={sovRange.maxVal}
          />
          <div className="flex justify-between mt-2 font-mono text-[10px] text-muted-foreground">
            {sovDates.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
        </div>
        <CompetitorLeaderboard
          title="Share of Voice by Competitor"
          data={data?.sovLeaderboard ?? []}
        />
      </div>

      {/* Average Position Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-xl ring-1 ring-black/[0.03]">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold">Average Position</h3>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border/60 rounded-lg">
              Overall <ChevronDown className="w-3 h-3" />
            </button>
          </div>
          <SparklineChart
            data={positionValues}
            minVal={positionRange.minVal}
            maxVal={positionRange.maxVal}
          />
          <div className="flex justify-between mt-2 font-mono text-[10px] text-muted-foreground">
            {positionDates.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
        </div>
        <CompetitorLeaderboard
          title="Average Position by Competitor"
          data={data?.positionLeaderboard ?? []}
        />
      </div>

      {/* Mention Rate by Topic */}
      <div className="bg-surface-container-lowest p-6 rounded-xl ring-1 ring-black/[0.03]">
        <h3 className="text-sm font-bold mb-6">Mention Rate by Topic</h3>
        <div className="space-y-5">
          {(data?.topicBars ?? []).map((topic) => (
            <div key={topic.topic}>
              <span className="text-xs font-medium mb-2 block">
                {topic.topic}
              </span>
              <div className="relative h-6 bg-surface-container-low rounded-full">
                {topic.brands.map((brand) => (
                  <div
                    key={brand.name}
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                    style={{ left: `${brand.value}%` }}
                  >
                    <div
                      className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-[8px] font-bold flex items-center justify-center"
                      title={brand.name}
                    >
                      {brand.name.substring(0, 2).toUpperCase()}
                    </div>
                  </div>
                ))}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 font-mono text-[9px] text-muted-foreground">
                  100%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Platform x Brand Heatmap */}
      <div className="bg-surface-container-lowest p-6 rounded-xl ring-1 ring-black/[0.03]">
        <h3 className="text-sm font-bold mb-6">
          Mention Rate by Platform x Brand
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="py-2 px-3 text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-normal">
                  Brand
                </th>
                {heatmapCols.map((p) => (
                  <th
                    key={p}
                    className="py-2 px-3 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-normal"
                  >
                    {p}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heatmapRows.map((brand) => (
                <tr key={brand}>
                  <td className="py-2 px-3 text-xs font-medium">{brand}</td>
                  {heatmapCols.map((col) => {
                    const val = heatmapLookup.get(`${brand}::${col}`) ?? 0;
                    return (
                      <td key={col} className="py-2 px-3 text-center">
                        <span
                          className={`inline-block w-full py-2 rounded font-mono text-xs font-bold ${getHeatmapColor(val)}`}
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
