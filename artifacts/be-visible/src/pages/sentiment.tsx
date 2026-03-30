import {
  Info,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Loader2,
} from "lucide-react";
import { useState, useMemo, useRef, useEffect } from "react";
import { useGetSentiment } from "@workspace/api-client-react";
import { useGlobalFilters } from "@/hooks/use-global-filters";

type SentimentFilter = "all" | "positive" | "negative";
type SortField = "theme" | "sentimentScore" | "volumePct" | "occurrences";
type SortDir = "asc" | "desc";

function SentimentFilterDropdown({
  value,
  onChange,
}: {
  value: SentimentFilter;
  onChange: (v: SentimentFilter) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const labels: Record<SentimentFilter, string> = {
    all: "All Sentiment",
    positive: "Positive",
    negative: "Negative",
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border/60 rounded-lg"
      >
        {labels[value]}
        <ChevronDown className="w-3 h-3" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-10 bg-surface-container-lowest border border-border/40 rounded-lg shadow-lg py-1 min-w-[140px]">
          {(Object.keys(labels) as SentimentFilter[]).map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-1.5 text-xs hover:bg-surface-container-low transition-colors ${
                value === opt ? "font-bold" : ""
              }`}
            >
              {labels[opt]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SortIndicator({
  field,
  sortBy,
  sortDir,
}: {
  field: SortField;
  sortBy: SortField;
  sortDir: SortDir;
}) {
  if (sortBy !== field) {
    return (
      <ChevronDown className="w-3 h-3 text-muted-foreground/30 inline ml-1" />
    );
  }
  return sortDir === "asc" ? (
    <ChevronUp className="w-3 h-3 inline ml-1" />
  ) : (
    <ChevronDown className="w-3 h-3 inline ml-1" />
  );
}

function SentimentChart({
  scoreSeries,
}: {
  scoreSeries: { date: string; value: number }[];
}) {
  const maxScore = 100;
  const minScore = Math.min(...scoreSeries.map((d) => d.value)) - 5;
  const range = maxScore - minScore;

  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl ring-1 ring-black/[0.03]">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-bold">Sentiment Score Over Time</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Your aggregate sentiment score across all captured brand mentions.
          </p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border/60 rounded-lg">
          Overall Score
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>
      <div className="mt-6 relative h-48">
        {/* Reference lines */}
        {[100, 75, 50, 25].map((line) => (
          <div
            key={line}
            className="absolute left-0 right-0 border-t border-dashed border-border/30 flex items-center"
            style={{
              bottom: `${((line - minScore) / range) * 100}%`,
            }}
          >
            <span className="font-mono text-[9px] text-muted-foreground/50 -translate-y-1/2 -ml-0">
              {line}
            </span>
          </div>
        ))}
        {/* Data points and line */}
        <svg
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
        >
          <polyline
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-primary"
            points={scoreSeries
              .map(
                (d, i) =>
                  `${(i / (scoreSeries.length - 1)) * 100}%,${100 - ((d.value - minScore) / range) * 100}%`,
              )
              .join(" ")}
          />
          {scoreSeries.map((d, i) => (
            <circle
              key={d.date}
              cx={`${(i / (scoreSeries.length - 1)) * 100}%`}
              cy={`${100 - ((d.value - minScore) / range) * 100}%`}
              r="4"
              className="fill-primary"
            />
          ))}
        </svg>
      </div>
      <div className="flex justify-between mt-2 font-mono text-[10px] text-muted-foreground">
        {scoreSeries.map((d) => (
          <span key={d.date}>{d.date}</span>
        ))}
      </div>
    </div>
  );
}

function ThemeRow({
  theme,
  sentimentScore,
  volumePct,
  occurrences,
  isPositive,
  exampleText,
}: {
  theme: string;
  sentimentScore: number;
  volumePct: number;
  occurrences: number;
  isPositive: boolean;
  exampleText?: string | null | undefined;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr
        className="border-b border-border/20 hover:bg-surface-container-low/50 cursor-pointer transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <td className="py-3 px-4">
          <button className="text-muted-foreground">
            {expanded ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </button>
        </td>
        <td className="py-3 px-4 text-sm font-medium">{theme}</td>
        <td className="py-3 px-4">
          <div className="flex items-center gap-2">
            <div className="w-12 h-1.5 bg-surface-container-low rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${isPositive ? "bg-emerald-500" : "bg-red-500"}`}
                style={{ width: `${sentimentScore}%` }}
              />
            </div>
            <span
              className={`font-mono text-xs font-bold ${isPositive ? "text-emerald-600" : "text-destructive"}`}
            >
              {sentimentScore}
            </span>
          </div>
        </td>
        <td className="py-3 px-4 font-mono text-xs text-muted-foreground">
          {volumePct}%
        </td>
        <td className="py-3 px-4 font-mono text-xs">{occurrences}</td>
      </tr>
      {expanded && (
        <tr className="bg-surface-container-low/30">
          <td />
          <td colSpan={4} className="py-3 px-4">
            <div className="text-xs text-muted-foreground italic leading-relaxed border-l-2 border-border/40 pl-3">
              "{exampleText}"
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function Treemap({
  treemapPositive,
  treemapNegative,
  sentimentFilter,
  onSentimentFilterChange,
}: {
  treemapPositive: { theme: string; occurrences: number }[];
  treemapNegative: { theme: string; occurrences: number }[];
  sentimentFilter: SentimentFilter;
  onSentimentFilterChange: (v: SentimentFilter) => void;
}) {
  const maxOccurrences = Math.max(
    ...treemapPositive.map((t) => t.occurrences),
    ...treemapNegative.map((t) => t.occurrences),
    1,
  );

  function sizeFor(occurrences: number) {
    return Math.max(Math.ceil((occurrences / maxOccurrences) * 6), 1);
  }

  const showPositive =
    sentimentFilter === "all" || sentimentFilter === "positive";
  const showNegative =
    sentimentFilter === "all" || sentimentFilter === "negative";

  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl ring-1 ring-black/[0.03]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-bold">Sentiment Chart</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Theme frequency and sentiment visualized. Size = frequency, color =
            sentiment.
          </p>
        </div>
        <SentimentFilterDropdown
          value={sentimentFilter}
          onChange={onSentimentFilterChange}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {showPositive &&
          treemapPositive.map((item) => {
            const size = sizeFor(item.occurrences);
            return (
              <div
                key={item.theme}
                className="bg-emerald-500/15 border border-emerald-500/20 rounded-lg p-3 flex flex-col justify-between"
                style={{
                  flexBasis: `${Math.max(size * 4, 12)}%`,
                  flexGrow: size,
                  minHeight: `${Math.max(size * 20, 60)}px`,
                }}
              >
                <span className="text-[10px] font-medium text-emerald-800 leading-tight">
                  {item.theme}
                </span>
                <span className="font-mono text-[10px] text-emerald-600 mt-1">
                  {item.occurrences}
                </span>
              </div>
            );
          })}
        {showNegative &&
          treemapNegative.map((item) => {
            const size = sizeFor(item.occurrences);
            return (
              <div
                key={item.theme}
                className="bg-red-500/10 border border-red-500/15 rounded-lg p-3 flex flex-col justify-between"
                style={{
                  flexBasis: `${Math.max(size * 4, 12)}%`,
                  flexGrow: size,
                  minHeight: "60px",
                }}
              >
                <span className="text-[10px] font-medium text-red-800 leading-tight">
                  {item.theme}
                </span>
                <span className="font-mono text-[10px] text-red-600 mt-1">
                  {item.occurrences}
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default function SentimentPage() {
  const { filterParams } = useGlobalFilters();
  const [sentimentFilter, setSentimentFilter] =
    useState<SentimentFilter>("all");
  const [sortBy, setSortBy] = useState<SortField>("occurrences");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const { data, isLoading, isError } = useGetSentiment({
    ...filterParams,
    sentimentFilter,
  });

  const sortedThemes = useMemo(() => {
    if (!data?.themes) return [];
    return [...data.themes].sort((a, b) => {
      let cmp = 0;
      switch (sortBy) {
        case "theme":
          cmp = a.theme.localeCompare(b.theme);
          break;
        case "sentimentScore":
          cmp = a.sentimentScore - b.sentimentScore;
          break;
        case "volumePct":
          cmp = a.volumePct - b.volumePct;
          break;
        case "occurrences":
          cmp = a.occurrences - b.occurrences;
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [data?.themes, sortBy, sortDir]);

  function handleSort(field: SortField) {
    if (sortBy === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDir("desc");
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">Sentiment</h1>
        <p className="text-sm text-muted-foreground">
          How AI models characterize and describe your brand.
        </p>
      </div>

      {/* KPI Cards */}
      {(data?.kpis ?? []).length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
                    className={`text-xs font-bold ${positive ? "text-emerald-600" : "text-destructive"}`}
                  >
                    {positive ? "\u2197" : "\u2198"} {card.change}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <SentimentChart scoreSeries={data?.scoreSeries ?? []} />

      {/* Themes Table */}
      <div className="bg-surface-container-lowest rounded-xl ring-1 ring-black/[0.03] overflow-hidden">
        <div className="p-6 border-b border-border/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold">Themes</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Top sentiment drivers, based on themes in answers.
              </p>
            </div>
            <SentimentFilterDropdown
              value={sentimentFilter}
              onChange={setSentimentFilter}
            />
          </div>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border/30">
              <th className="py-2 px-4 w-8" />
              <th
                className="py-2 px-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-normal cursor-pointer select-none"
                onClick={() => handleSort("theme")}
              >
                Theme
                <SortIndicator
                  field="theme"
                  sortBy={sortBy}
                  sortDir={sortDir}
                />
              </th>
              <th
                className="py-2 px-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-normal cursor-pointer select-none"
                onClick={() => handleSort("sentimentScore")}
              >
                Sentiment Score
                <SortIndicator
                  field="sentimentScore"
                  sortBy={sortBy}
                  sortDir={sortDir}
                />
              </th>
              <th
                className="py-2 px-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-normal cursor-pointer select-none"
                onClick={() => handleSort("volumePct")}
              >
                Volume
                <SortIndicator
                  field="volumePct"
                  sortBy={sortBy}
                  sortDir={sortDir}
                />
              </th>
              <th
                className="py-2 px-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-normal cursor-pointer select-none"
                onClick={() => handleSort("occurrences")}
              >
                Occurrences
                <SortIndicator
                  field="occurrences"
                  sortBy={sortBy}
                  sortDir={sortDir}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedThemes.map((t) => (
              <ThemeRow key={t.id} {...t} />
            ))}
          </tbody>
        </table>
      </div>

      <Treemap
        treemapPositive={data?.treemapPositive ?? []}
        treemapNegative={data?.treemapNegative ?? []}
        sentimentFilter={sentimentFilter}
        onSentimentFilterChange={setSentimentFilter}
      />
    </div>
  );
}
