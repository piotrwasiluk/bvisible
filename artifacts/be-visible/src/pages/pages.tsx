import { useState, useEffect, useMemo, useCallback, Fragment } from "react";
import {
  Search,
  Upload,
  Sparkles,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Loader2,
  FolderOpen,
  X,
  Zap,
  TrendingDown,
  MousePointerClick,
} from "lucide-react";
import { useGetPages } from "@workspace/api-client-react";
import { useGlobalFilters } from "@/hooks/use-global-filters";
import type { PageRecord } from "@workspace/api-client-react";

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

function ChangeCell({ value, change }: { value: string; change: string }) {
  const isPositive = change.startsWith("+") && change !== "+0%";
  const isNegative = change.startsWith("-");
  return (
    <td className="py-3 px-3">
      <div className="flex flex-col">
        <span className="font-mono text-xs">{value}</span>
        <span
          className={`font-mono text-[10px] ${isPositive ? "text-emerald-600" : isNegative ? "text-destructive" : "text-muted-foreground"}`}
        >
          {change}
        </span>
      </div>
    </td>
  );
}

function formatValue(
  val: number,
  type: "number" | "percent" | "decimal",
): string {
  if (type === "percent") return `${val.toFixed(2)}%`;
  if (type === "decimal") return val.toFixed(1);
  if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
  return String(val);
}

function formatChange(val: number): string {
  if (val === 0) return "0%";
  const sign = val > 0 ? "+" : "";
  return `${sign}${val}%`;
}

type SortField =
  | "clicks"
  | "impressions"
  | "position"
  | "ctr"
  | "citationCount"
  | "citationRate";
type SortDir = "asc" | "desc";

const SMART_FILTERS = [
  {
    key: "high-citations",
    label: "High Citations",
    icon: Zap,
    description: "Pages with 100+ citations",
  },
  {
    key: "zero-clicks",
    label: "Zero Clicks",
    icon: MousePointerClick,
    description: "Pages with zero clicks",
  },
  {
    key: "declining",
    label: "Declining",
    icon: TrendingDown,
    description: "Pages losing impressions or citations",
  },
] as const;

type SmartFilterKey = (typeof SMART_FILTERS)[number]["key"];

export default function PagesPage() {
  const [view, setView] = useState<"page" | "folder">("page");
  const [searchInput, setSearchInput] = useState("");
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [smartFilter, setSmartFilter] = useState<SmartFilterKey | null>(null);
  const [showSmartFilters, setShowSmartFilters] = useState(false);

  const debouncedSearch = useDebounce(searchInput, 300);
  const { filterParams } = useGlobalFilters();

  const sortParam = sortField ? `${sortField}:${sortDir}` : undefined;

  const { data, isLoading } = useGetPages({
    ...filterParams,
    search: debouncedSearch || undefined,
    sort: sortParam,
    view,
  });

  const items = data?.items ?? [];

  // Apply smart filters client-side
  const filteredItems = useMemo(() => {
    if (!smartFilter) return items;
    switch (smartFilter) {
      case "high-citations":
        return items.filter((p) => p.citationCount >= 100);
      case "zero-clicks":
        return items.filter((p) => p.clicks === 0);
      case "declining":
        return items.filter(
          (p) => p.impressionsChange < 0 || p.citationCountChange < 0,
        );
      default:
        return items;
    }
  }, [items, smartFilter]);

  // Group by folder when in folder view
  const groupedByFolder = useMemo(() => {
    if (view !== "folder") return null;
    const groups: Record<string, PageRecord[]> = {};
    for (const item of filteredItems) {
      const folder = item.folder || "other";
      if (!groups[folder]) groups[folder] = [];
      groups[folder].push(item);
    }
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredItems, view]);

  const handleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        setSortDir((d) => (d === "desc" ? "asc" : "desc"));
      } else {
        setSortField(field);
        setSortDir("desc");
      }
    },
    [sortField],
  );

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field)
      return (
        <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-50" />
      );
    return sortDir === "desc" ? (
      <ArrowDown className="w-3 h-3 text-foreground" />
    ) : (
      <ArrowUp className="w-3 h-3 text-foreground" />
    );
  }

  const thClass =
    "py-3 px-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-normal cursor-pointer select-none group";

  function renderRow(p: PageRecord) {
    return (
      <tr
        key={p.id}
        className="border-b border-border/10 hover:bg-surface-container-low/30 transition-colors"
      >
        <td className="py-3 px-3">
          <input type="checkbox" className="rounded border-border" />
        </td>
        <td className="py-3 px-3">
          <span
            className="text-xs font-medium text-foreground truncate block max-w-[240px]"
            title={p.url}
          >
            {p.url}
          </span>
        </td>
        {view === "page" && (
          <td className="py-3 px-3">
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <FolderOpen className="w-3 h-3" /> {p.folder}
            </span>
          </td>
        )}
        <td className="py-3 px-3">
          <span className="text-[11px] text-muted-foreground">
            {p.primaryKeyword || "\u2014"}
          </span>
        </td>
        <ChangeCell
          value={formatValue(p.clicks, "number")}
          change={formatChange(p.clicksChange)}
        />
        <ChangeCell
          value={formatValue(p.impressions, "number")}
          change={formatChange(p.impressionsChange)}
        />
        <ChangeCell
          value={formatValue(p.position, "decimal")}
          change={formatChange(p.positionChange)}
        />
        <ChangeCell
          value={formatValue(p.ctr, "percent")}
          change={formatChange(p.ctrChange)}
        />
        <ChangeCell
          value={formatValue(p.citationCount, "number")}
          change={formatChange(p.citationCountChange)}
        />
        <ChangeCell
          value={formatValue(p.citationRate, "percent")}
          change={formatChange(p.citationRateChange)}
        />
      </tr>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Pages</h1>
          <p className="text-sm text-muted-foreground">
            URL-level performance bridging traditional SEO with AI search
            metrics.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowSmartFilters(!showSmartFilters)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                smartFilter
                  ? "bg-emerald-500/20 text-emerald-700 border border-emerald-500/30"
                  : "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 hover:bg-emerald-500/15"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Smart Filters
              {smartFilter && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setSmartFilter(null);
                    setShowSmartFilters(false);
                  }}
                  className="ml-1 hover:text-emerald-900"
                >
                  <X className="w-3 h-3" />
                </span>
              )}
            </button>
            {showSmartFilters && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-surface-container-lowest rounded-xl ring-1 ring-black/[0.08] shadow-lg z-50 p-1">
                {SMART_FILTERS.map((f) => {
                  const Icon = f.icon;
                  return (
                    <button
                      key={f.key}
                      onClick={() => {
                        setSmartFilter(smartFilter === f.key ? null : f.key);
                        setShowSmartFilters(false);
                      }}
                      className={`w-full flex items-start gap-2.5 px-3 py-2.5 rounded-lg text-left transition-colors ${
                        smartFilter === f.key
                          ? "bg-emerald-500/10"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 mt-0.5 text-emerald-600 shrink-0" />
                      <div>
                        <div className="text-xs font-medium">{f.label}</div>
                        <div className="text-[10px] text-muted-foreground">
                          {f.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 bg-surface-container-low rounded-lg p-1">
            <button
              onClick={() => setView("page")}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${view === "page" ? "bg-surface-container-lowest shadow-sm text-foreground" : "text-muted-foreground"}`}
            >
              Page
            </button>
            <button
              onClick={() => setView("folder")}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${view === "folder" ? "bg-surface-container-lowest shadow-sm text-foreground" : "text-muted-foreground"}`}
            >
              Folder
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search pages..."
              className="pl-9 pr-4 py-1.5 text-xs border border-border/60 rounded-lg bg-surface-container-lowest w-56 focus:outline-none focus:ring-1 focus:ring-primary/20"
            />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border/60 rounded-lg hover:bg-muted/50 transition-colors">
            <Upload className="w-3.5 h-3.5" />
            Upload Sitemap
          </button>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">
            Loading pages...
          </span>
        </div>
      )}

      {/* Table */}
      {!isLoading && (
        <div className="bg-surface-container-lowest rounded-xl ring-1 ring-black/[0.03] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border/30 bg-surface-container-low/50">
                  <th className="py-3 px-3 w-8">
                    <input type="checkbox" className="rounded border-border" />
                  </th>
                  <th className="py-3 px-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-normal min-w-[240px]">
                    Page
                  </th>
                  {view === "page" && (
                    <th className="py-3 px-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-normal">
                      Folder
                    </th>
                  )}
                  <th className="py-3 px-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-normal min-w-[160px]">
                    Primary Keyword
                  </th>
                  <th className={thClass} onClick={() => handleSort("clicks")}>
                    <div className="flex items-center gap-1">
                      Clicks <SortIcon field="clicks" />
                    </div>
                  </th>
                  <th
                    className={thClass}
                    onClick={() => handleSort("impressions")}
                  >
                    <div className="flex items-center gap-1">
                      Impressions <SortIcon field="impressions" />
                    </div>
                  </th>
                  <th
                    className={thClass}
                    onClick={() => handleSort("position")}
                  >
                    <div className="flex items-center gap-1">
                      Position <SortIcon field="position" />
                    </div>
                  </th>
                  <th className={thClass} onClick={() => handleSort("ctr")}>
                    <div className="flex items-center gap-1">
                      CTR <SortIcon field="ctr" />
                    </div>
                  </th>
                  <th
                    className={thClass}
                    onClick={() => handleSort("citationCount")}
                  >
                    <div className="flex items-center gap-1">
                      Citations <SortIcon field="citationCount" />
                    </div>
                  </th>
                  <th
                    className={thClass}
                    onClick={() => handleSort("citationRate")}
                  >
                    <div className="flex items-center gap-1">
                      Citation Rate <SortIcon field="citationRate" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {view === "folder" && groupedByFolder
                  ? groupedByFolder.map(([folder, pages]) => (
                      <Fragment key={folder}>
                        <tr className="bg-surface-container-low/80">
                          <td colSpan={10} className="py-2.5 px-3">
                            <div className="flex items-center gap-2">
                              <FolderOpen className="w-3.5 h-3.5 text-muted-foreground" />
                              <span className="text-xs font-semibold text-foreground">
                                /{folder}
                              </span>
                              <span className="text-[10px] text-muted-foreground font-mono">
                                {pages.length}{" "}
                                {pages.length === 1 ? "page" : "pages"}
                              </span>
                            </div>
                          </td>
                        </tr>
                        {pages.map(renderRow)}
                      </Fragment>
                    ))
                  : filteredItems.map(renderRow)}
                {filteredItems.length === 0 && (
                  <tr>
                    <td
                      colSpan={view === "page" ? 10 : 9}
                      className="py-12 text-center text-sm text-muted-foreground"
                    >
                      No pages found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination info */}
          {data && (
            <div className="px-4 py-3 border-t border-border/20 flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Showing {filteredItems.length} of {data.total} pages
              </span>
              <span>
                Page {data.page} of {Math.ceil(data.total / data.limit)}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
