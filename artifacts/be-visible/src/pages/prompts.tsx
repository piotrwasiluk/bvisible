import { useState, useEffect, useMemo, Fragment } from "react";
import {
  Search,
  Plus,
  Pencil,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Filter as FilterIcon,
  Loader2,
} from "lucide-react";
import { useGetPrompts } from "@workspace/api-client-react";
import type { PromptRecord } from "@workspace/api-client-react";
import { useGlobalFilters } from "@/hooks/use-global-filters";

function formatRate(value: number): string {
  return `${value.toFixed(1)}%`;
}

function formatChange(value: number): string {
  if (value === 0) return "0.0%";
  return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
}

function changeDirection(value: number): boolean | null {
  if (value > 0) return true;
  if (value < 0) return false;
  return null;
}

type SortField =
  | "text"
  | "topicName"
  | "fanoutCount"
  | "type"
  | "searchVolume"
  | "mentionRate"
  | "citationRate";

interface SortableHeaderProps {
  label: string;
  field: SortField;
  currentSort: string;
  onSort: (field: SortField) => void;
  className?: string;
}

function SortableHeader({
  label,
  field,
  currentSort,
  onSort,
  className = "",
}: SortableHeaderProps) {
  const isActive = currentSort === field || currentSort === `-${field}`;
  const isDesc = currentSort === `-${field}`;

  return (
    <th
      className={`py-3 px-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-normal cursor-pointer select-none hover:text-foreground transition-colors ${className}`}
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        {isActive &&
          (isDesc ? (
            <ChevronDown className="w-3 h-3" />
          ) : (
            <ChevronUp className="w-3 h-3" />
          ))}
      </div>
    </th>
  );
}

function PromptRow({ p }: { p: PromptRecord }) {
  const mentionUp = changeDirection(p.mentionRateChange);
  const citationUp = changeDirection(p.citationRateChange);
  const tags = p.tags ?? [];
  const topicColor = p.topicColor ?? "bg-zinc-500";
  const topicName = p.topicName ?? "Uncategorized";

  return (
    <tr className="border-b border-border/10 hover:bg-surface-container-low/30 transition-colors">
      <td className="py-3 px-4">
        <input type="checkbox" className="rounded border-border" />
      </td>
      <td className="py-3 px-4">
        <span className="text-sm font-medium leading-snug">{p.text}</span>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${topicColor}`} />
          <span className="text-[11px] text-muted-foreground whitespace-nowrap">
            {topicName.length > 25
              ? topicName.substring(0, 25) + "..."
              : topicName}
          </span>
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: Math.min(tags.length, 4) }).map((_, j) => (
            <div
              key={j}
              className={`w-2 h-2 rounded-full ${
                [
                  "bg-blue-400",
                  "bg-emerald-400",
                  "bg-amber-400",
                  "bg-pink-400",
                ][j]
              }`}
            />
          ))}
          <span className="text-[10px] text-muted-foreground ml-1">
            {tags.length}
          </span>
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-1">
          <FilterIcon className="w-3 h-3 text-muted-foreground" />
          <span className="font-mono text-xs">{p.fanoutCount}</span>
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-purple-500" />
          <span className="text-[11px] text-muted-foreground whitespace-nowrap">
            {p.type}
          </span>
        </div>
      </td>
      <td className="py-3 px-4">
        <span className="font-mono text-xs">
          {p.searchVolume != null ? p.searchVolume.toLocaleString() : "--"}
        </span>
      </td>
      <td className="py-3 px-4">
        <div className="flex flex-col">
          <span className="font-mono text-xs">{formatRate(p.mentionRate)}</span>
          <span
            className={`font-mono text-[10px] ${
              mentionUp === true
                ? "text-emerald-600"
                : mentionUp === false
                  ? "text-destructive"
                  : "text-muted-foreground"
            }`}
          >
            {formatChange(p.mentionRateChange)}
          </span>
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex flex-col">
          <span className="font-mono text-xs">
            {formatRate(p.citationRate)}
          </span>
          <span
            className={`font-mono text-[10px] ${
              citationUp === true
                ? "text-emerald-600"
                : citationUp === false
                  ? "text-destructive"
                  : "text-muted-foreground"
            }`}
          >
            {formatChange(p.citationRateChange)}
          </span>
        </div>
      </td>
    </tr>
  );
}

export default function PromptsPage() {
  const { filterParams } = useGlobalFilters();
  const [view, setView] = useState<"prompt" | "topic">("prompt");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSort = (field: SortField) => {
    setSort((prev) => {
      if (prev === field) return `-${field}`;
      if (prev === `-${field}`) return "";
      return field;
    });
  };

  const { data, isLoading } = useGetPrompts({
    ...filterParams,
    search: debouncedSearch || undefined,
    sort: sort || undefined,
    view,
  });

  const items = data?.items ?? [];

  // Group items by topic for topic view
  const groupedByTopic = useMemo(() => {
    if (view !== "topic") return null;
    const groups: Record<string, PromptRecord[]> = {};
    for (const item of items) {
      const topic = item.topicName ?? "Uncategorized";
      if (!groups[topic]) groups[topic] = [];
      groups[topic].push(item);
    }
    return groups;
  }, [items, view]);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Prompts</h1>
          <p className="text-sm text-muted-foreground">
            Manage and analyze the prompts being tracked across AI platforms.
          </p>
        </div>
      </div>

      {/* View Toggle & Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 bg-surface-container-low rounded-lg p-1">
          <button
            onClick={() => setView("prompt")}
            className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${
              view === "prompt"
                ? "bg-surface-container-lowest shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Prompt
          </button>
          <button
            onClick={() => setView("topic")}
            className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${
              view === "topic"
                ? "bg-surface-container-lowest shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Topic
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 text-xs border border-border/60 rounded-lg bg-surface-container-lowest w-64 focus:outline-none focus:ring-1 focus:ring-primary/20"
            />
          </div>
          <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border/60 rounded-lg hover:bg-muted/50 transition-colors">
            <Pencil className="w-3.5 h-3.5" />
            Edit Topics
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors">
            <Plus className="w-3.5 h-3.5" />
            Add Prompts
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
        </div>
      )}

      {/* Prompt Table */}
      {!isLoading && (
        <div className="bg-surface-container-lowest rounded-xl ring-1 ring-black/[0.03] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border/30 bg-surface-container-low/50">
                  <th className="py-3 px-4 w-8">
                    <input type="checkbox" className="rounded border-border" />
                  </th>
                  <SortableHeader
                    label="Prompt"
                    field="text"
                    currentSort={sort}
                    onSort={handleSort}
                    className="min-w-[320px]"
                  />
                  <SortableHeader
                    label="Topic"
                    field="topicName"
                    currentSort={sort}
                    onSort={handleSort}
                  />
                  <th className="py-3 px-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-normal">
                    Tags
                  </th>
                  <SortableHeader
                    label="Fanouts"
                    field="fanoutCount"
                    currentSort={sort}
                    onSort={handleSort}
                  />
                  <SortableHeader
                    label="Type"
                    field="type"
                    currentSort={sort}
                    onSort={handleSort}
                  />
                  <SortableHeader
                    label="Volume"
                    field="searchVolume"
                    currentSort={sort}
                    onSort={handleSort}
                  />
                  <SortableHeader
                    label="Mention Rate"
                    field="mentionRate"
                    currentSort={sort}
                    onSort={handleSort}
                  />
                  <SortableHeader
                    label="Citation Rate"
                    field="citationRate"
                    currentSort={sort}
                    onSort={handleSort}
                  />
                </tr>
              </thead>
              <tbody>
                {view === "prompt" &&
                  items.map((p) => <PromptRow key={p.id} p={p} />)}

                {view === "topic" &&
                  groupedByTopic &&
                  Object.entries(groupedByTopic).map(
                    ([topicName, topicItems]) => {
                      const topicColor =
                        topicItems[0]?.topicColor ?? "bg-zinc-500";
                      return (
                        <Fragment key={topicName}>
                          <tr className="bg-surface-container-low/70">
                            <td colSpan={9} className="py-2.5 px-4">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-2.5 h-2.5 rounded-full ${topicColor}`}
                                />
                                <span className="text-xs font-semibold tracking-wide">
                                  {topicName}
                                </span>
                                <span className="text-[10px] text-muted-foreground font-mono">
                                  ({topicItems.length})
                                </span>
                              </div>
                            </td>
                          </tr>
                          {topicItems.map((p) => (
                            <PromptRow key={p.id} p={p} />
                          ))}
                        </Fragment>
                      );
                    },
                  )}

                {items.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      className="py-12 text-center text-sm text-muted-foreground"
                    >
                      No prompts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination info */}
          {data && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border/20">
              <span className="text-[11px] text-muted-foreground font-mono">
                Showing {items.length} of {data.total} prompts
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
