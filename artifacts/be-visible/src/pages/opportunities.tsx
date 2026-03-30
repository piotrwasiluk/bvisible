import { useState, useMemo } from "react";
import {
  Lightbulb,
  Target,
  ExternalLink,
  ArrowUpRight,
  Loader2,
  TrendingUp,
  TrendingDown,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useGetOpportunities } from "@workspace/api-client-react";
import { useGlobalFilters } from "@/hooks/use-global-filters";
import type {
  OpportunitiesDataContentGapsItem,
  OpportunitiesDataOffsitePlacementsItem,
} from "@workspace/api-client-react";

type SortDir = "asc" | "desc";

function SortIndicator({
  column,
  sortBy,
  sortDir,
}: {
  column: string;
  sortBy: string | null;
  sortDir: SortDir;
}) {
  if (sortBy !== column) return null;
  return sortDir === "asc" ? (
    <ChevronUp className="w-3 h-3 inline-block ml-0.5" />
  ) : (
    <ChevronDown className="w-3 h-3 inline-block ml-0.5" />
  );
}

function sortRows<T>(rows: T[], sortBy: string | null, sortDir: SortDir): T[] {
  if (!sortBy) return rows;
  return [...rows].sort((a, b) => {
    const aVal = (a as Record<string, unknown>)[sortBy];
    const bVal = (b as Record<string, unknown>)[sortBy];
    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortDir === "asc" ? aVal - bVal : bVal - aVal;
    }
    const aStr = String(aVal ?? "");
    const bStr = String(bVal ?? "");
    return sortDir === "asc"
      ? aStr.localeCompare(bStr)
      : bStr.localeCompare(aStr);
  });
}

export default function OpportunitiesPage() {
  const { filterParams } = useGlobalFilters();
  const { data, isLoading, isError } = useGetOpportunities(filterParams);

  // Content Gaps sort state
  const [gapSortBy, setGapSortBy] = useState<
    keyof OpportunitiesDataContentGapsItem | null
  >(null);
  const [gapSortDir, setGapSortDir] = useState<SortDir>("desc");

  // Offsite Placements sort state
  const [offSortBy, setOffSortBy] = useState<
    keyof OpportunitiesDataOffsitePlacementsItem | null
  >(null);
  const [offSortDir, setOffSortDir] = useState<SortDir>("desc");

  function toggleGapSort(col: keyof OpportunitiesDataContentGapsItem) {
    if (gapSortBy === col) {
      setGapSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setGapSortBy(col);
      setGapSortDir("desc");
    }
  }

  function toggleOffSort(col: keyof OpportunitiesDataOffsitePlacementsItem) {
    if (offSortBy === col) {
      setOffSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setOffSortBy(col);
      setOffSortDir("desc");
    }
  }

  const sortedGaps = useMemo(
    () => sortRows(data?.contentGaps ?? [], gapSortBy, gapSortDir),
    [data?.contentGaps, gapSortBy, gapSortDir],
  );

  const sortedOffsite = useMemo(
    () => sortRows(data?.offsitePlacements ?? [], offSortBy, offSortDir),
    [data?.offsitePlacements, offSortBy, offSortDir],
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const thClass =
    "py-3 px-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-normal cursor-pointer select-none hover:text-foreground transition-colors";

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">
          Opportunities
        </h1>
        <p className="text-sm text-muted-foreground">
          Actionable opportunities to improve AI visibility — content gaps and
          off-site placements.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(data?.kpis ?? []).map((kpi) => (
          <div
            key={kpi.label}
            className="bg-surface-container-lowest p-6 rounded-xl ring-1 ring-black/[0.03]"
          >
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {kpi.label}
            </span>
            <div className="text-3xl font-bold tracking-tight mt-2">
              {kpi.value}
            </div>
            {kpi.change && (
              <div className="flex items-center gap-1 mt-1">
                {kpi.trend === "up" ? (
                  <TrendingUp className="w-3 h-3 text-emerald-600" />
                ) : kpi.trend === "down" ? (
                  <TrendingDown className="w-3 h-3 text-destructive" />
                ) : null}
                <span
                  className={`font-mono text-xs ${
                    kpi.trend === "up"
                      ? "text-emerald-600"
                      : kpi.trend === "down"
                        ? "text-destructive"
                        : "text-muted-foreground"
                  }`}
                >
                  {kpi.change}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Content Gap Analysis */}
      <div className="bg-surface-container-lowest rounded-xl ring-1 ring-black/[0.03] overflow-hidden">
        <div className="p-6 border-b border-border/20 flex items-center gap-3">
          <Target className="w-5 h-5 text-primary" />
          <div>
            <h3 className="text-sm font-bold">Content Gap Analysis</h3>
            <p className="text-xs text-muted-foreground">
              Prompts where competitors are mentioned but you are not.
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border/30 bg-surface-container-low/50">
                <th
                  className={`${thClass} min-w-[260px]`}
                  onClick={() => toggleGapSort("prompt")}
                >
                  Prompt / Topic
                  <SortIndicator
                    column="prompt"
                    sortBy={gapSortBy}
                    sortDir={gapSortDir}
                  />
                </th>
                <th
                  className={thClass}
                  onClick={() => toggleGapSort("yourRate")}
                >
                  Your Rate
                  <SortIndicator
                    column="yourRate"
                    sortBy={gapSortBy}
                    sortDir={gapSortDir}
                  />
                </th>
                <th
                  className={thClass}
                  onClick={() => toggleGapSort("topCompetitor")}
                >
                  Top Competitor
                  <SortIndicator
                    column="topCompetitor"
                    sortBy={gapSortBy}
                    sortDir={gapSortDir}
                  />
                </th>
                <th
                  className={thClass}
                  onClick={() => toggleGapSort("theirRate")}
                >
                  Their Rate
                  <SortIndicator
                    column="theirRate"
                    sortBy={gapSortBy}
                    sortDir={gapSortDir}
                  />
                </th>
                <th
                  className={thClass}
                  onClick={() => toggleGapSort("suggestedAction")}
                >
                  Suggested Action
                  <SortIndicator
                    column="suggestedAction"
                    sortBy={gapSortBy}
                    sortDir={gapSortDir}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedGaps.map((g, i) => (
                <tr
                  key={i}
                  className="border-b border-border/10 hover:bg-surface-container-low/30 transition-colors"
                >
                  <td className="py-3 px-4 text-sm font-medium">{g.prompt}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`font-mono text-xs ${g.yourRate === 0 ? "text-destructive" : "text-amber-600"}`}
                    >
                      {g.yourRate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs text-muted-foreground">
                    {g.topCompetitor}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-xs text-emerald-600">
                      {g.theirRate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-xs text-primary hover:underline flex items-center gap-1">
                      {g.suggestedAction} <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Off-Site Placement Opportunities */}
      <div className="bg-surface-container-lowest rounded-xl ring-1 ring-black/[0.03] overflow-hidden">
        <div className="p-6 border-b border-border/20 flex items-center gap-3">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <div>
            <h3 className="text-sm font-bold">
              Off-Site Placement Opportunities
            </h3>
            <p className="text-xs text-muted-foreground">
              High-influence sources where your brand is not yet referenced.
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border/30 bg-surface-container-low/50">
                <th
                  className={`${thClass} min-w-[260px]`}
                  onClick={() => toggleOffSort("url")}
                >
                  Source URL
                  <SortIndicator
                    column="url"
                    sortBy={offSortBy}
                    sortDir={offSortDir}
                  />
                </th>
                <th
                  className={thClass}
                  onClick={() => toggleOffSort("influence")}
                >
                  Influence
                  <SortIndicator
                    column="influence"
                    sortBy={offSortBy}
                    sortDir={offSortDir}
                  />
                </th>
                <th
                  className={thClass}
                  onClick={() => toggleOffSort("citations")}
                >
                  Citations
                  <SortIndicator
                    column="citations"
                    sortBy={offSortBy}
                    sortDir={offSortDir}
                  />
                </th>
                <th
                  className={thClass}
                  onClick={() => toggleOffSort("domainType")}
                >
                  Type
                  <SortIndicator
                    column="domainType"
                    sortBy={offSortBy}
                    sortDir={offSortDir}
                  />
                </th>
                <th className={thClass} onClick={() => toggleOffSort("da")}>
                  DA
                  <SortIndicator
                    column="da"
                    sortBy={offSortBy}
                    sortDir={offSortDir}
                  />
                </th>
                <th className={thClass} onClick={() => toggleOffSort("topics")}>
                  Topics
                  <SortIndicator
                    column="topics"
                    sortBy={offSortBy}
                    sortDir={offSortDir}
                  />
                </th>
                <th
                  className={thClass}
                  onClick={() => toggleOffSort("competitors")}
                >
                  Competitors
                  <SortIndicator
                    column="competitors"
                    sortBy={offSortBy}
                    sortDir={offSortDir}
                  />
                </th>
                <th className={thClass} onClick={() => toggleOffSort("action")}>
                  Action
                  <SortIndicator
                    column="action"
                    sortBy={offSortBy}
                    sortDir={offSortDir}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedOffsite.map((o, i) => (
                <tr
                  key={i}
                  className="border-b border-border/10 hover:bg-surface-container-low/30 transition-colors"
                >
                  <td className="py-3 px-4">
                    <span className="text-xs font-medium flex items-center gap-1">
                      {o.url}{" "}
                      <ExternalLink className="w-3 h-3 text-muted-foreground" />
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-1.5 bg-surface-container-low rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${o.influence}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs">{o.influence}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-xs">{o.citations}</td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] text-muted-foreground">
                      {o.domainType}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-xs">{o.da}</td>
                  <td className="py-3 px-4 text-[11px] text-muted-foreground">
                    {o.topics}
                  </td>
                  <td className="py-3 px-4 text-[11px] text-muted-foreground">
                    {o.competitors}
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-xs text-primary hover:underline">
                      {o.action}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
