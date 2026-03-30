import { useState, useEffect, useCallback } from "react";
import { Download, Search, ExternalLink, Loader2 } from "lucide-react";
import { useGetCitations } from "@workspace/api-client-react";
import { useGlobalFilters } from "@/hooks/use-global-filters";
import type { CitationRecord } from "@workspace/api-client-react";

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

function domainTypeColor(domainType: string): string {
  switch (domainType.toLowerCase()) {
    case "owned":
      return "bg-blue-100 text-blue-800";
    case "products":
      return "bg-emerald-100 text-emerald-800";
    case "competitors":
      return "bg-red-100 text-red-800";
    case "educational":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function exportCsv(items: CitationRecord[], view: "url" | "domain") {
  const headers =
    view === "url"
      ? [
          "URL",
          "Brand Reference",
          "Competitor References",
          "Influence Score",
          "Domain",
          "Domain Type",
          "Domain Authority",
          "Page Type",
          "Citations",
        ]
      : [
          "Domain",
          "Domain Type",
          "Domain Authority",
          "Influence Score",
          "Citations",
          "Brand Reference",
        ];

  const rows = items.map((c) =>
    view === "url"
      ? [
          c.url,
          c.hasBrandReference ? "Yes" : "No",
          (c.competitorReferences ?? []).join("; "),
          String(c.influenceScore),
          c.domain,
          c.domainType,
          String(c.domainAuthority ?? ""),
          c.pageType ?? "",
          String(c.citations),
        ]
      : [
          c.domain,
          c.domainType,
          String(c.domainAuthority ?? ""),
          String(c.influenceScore),
          String(c.citations),
          c.hasBrandReference ? "Yes" : "No",
        ],
  );

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `citations-${view}-export.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function CitationsDetailPage() {
  const [view, setView] = useState<"url" | "domain">("url");
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 300);
  const { filterParams } = useGlobalFilters();

  const { data, isLoading } = useGetCitations({
    ...filterParams,
    search: debouncedSearch || undefined,
    view,
  });

  const items = data?.items ?? [];

  const handleExport = useCallback(() => {
    if (items.length > 0) {
      exportCsv(items, view);
    }
  }, [items, view]);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">
            Citations Detail
          </h1>
          <p className="text-sm text-muted-foreground">
            Every source cited by AI engines in response to tracked prompts.
          </p>
        </div>
      </div>

      {/* Upsell Banner */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/10 rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">
            Offsite: Turn insights into placements
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            AirOps handles outreach, negotiation, and placement, so citations
            actually move the needle on your visibility.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-lg">
            Talk to our team
          </button>
          <button className="text-muted-foreground hover:text-foreground text-xs px-2">
            x
          </button>
        </div>
      </div>

      {/* Toggle, Search & Export */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 bg-surface-container-low rounded-lg p-1">
          <button
            onClick={() => setView("url")}
            className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${view === "url" ? "bg-surface-container-lowest shadow-sm text-foreground" : "text-muted-foreground"}`}
          >
            URL
          </button>
          <button
            onClick={() => setView("domain")}
            className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${view === "domain" ? "bg-surface-container-lowest shadow-sm text-foreground" : "text-muted-foreground"}`}
          >
            Domain
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={`Search ${view === "url" ? "URLs" : "domains"}...`}
              className="pl-9 pr-4 py-1.5 text-xs border border-border/60 rounded-lg bg-surface-container-lowest w-56 focus:outline-none focus:ring-1 focus:ring-primary/20"
            />
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border/60 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV ({data?.total ?? 0} rows)
          </button>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">
            Loading citations...
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
                  {view === "url" ? (
                    <>
                      <th className="py-3 px-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-normal min-w-[280px]">
                        URL
                      </th>
                      <th className="py-3 px-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-normal">
                        Brand Ref
                      </th>
                      <th className="py-3 px-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-normal">
                        Competitors Ref
                      </th>
                      <th className="py-3 px-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-normal">
                        Influence
                      </th>
                      <th className="py-3 px-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-normal">
                        Domain
                      </th>
                      <th className="py-3 px-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-normal">
                        Domain Type
                      </th>
                      <th className="py-3 px-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-normal">
                        DA
                      </th>
                      <th className="py-3 px-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-normal">
                        Page Type
                      </th>
                    </>
                  ) : (
                    <>
                      <th className="py-3 px-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-normal min-w-[180px]">
                        Domain
                      </th>
                      <th className="py-3 px-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-normal">
                        Domain Type
                      </th>
                      <th className="py-3 px-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-normal">
                        DA
                      </th>
                      <th className="py-3 px-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-normal">
                        Influence
                      </th>
                      <th className="py-3 px-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-normal">
                        Citations
                      </th>
                      <th className="py-3 px-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-normal">
                        Brand Ref
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {items.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-border/10 hover:bg-surface-container-low/30 transition-colors"
                  >
                    <td className="py-3 px-3">
                      <input
                        type="checkbox"
                        className="rounded border-border"
                      />
                    </td>
                    {view === "url" ? (
                      <>
                        <td className="py-3 px-3">
                          <span className="text-xs font-medium truncate block max-w-[280px]">
                            {c.url}
                            <ExternalLink className="w-3 h-3 text-muted-foreground shrink-0 inline ml-1" />
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          {c.hasBrandReference ? (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                              Yes
                            </span>
                          ) : (
                            <span className="text-[10px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">
                              No
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          {(c.competitorReferences ?? []).length > 0 ? (
                            <span className="text-[10px] text-muted-foreground">
                              {(c.competitorReferences ?? []).join(", ")}
                            </span>
                          ) : (
                            <span className="text-[10px] text-muted-foreground/50">
                              No competitors
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-1.5 bg-surface-container-low rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${c.influenceScore}%` }}
                              />
                            </div>
                            <span className="font-mono text-xs">
                              {c.influenceScore}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-xs font-medium">
                            {c.domain}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${domainTypeColor(c.domainType)}`}
                          >
                            {c.domainType}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-mono text-xs">
                            {c.domainAuthority ?? "\u2014"}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-[11px] text-muted-foreground">
                            {c.pageType ?? "\u2014"}
                          </span>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-3 px-3">
                          <span className="text-xs font-medium">
                            {c.domain}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${domainTypeColor(c.domainType)}`}
                          >
                            {c.domainType}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-mono text-xs">
                            {c.domainAuthority ?? "\u2014"}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-1.5 bg-surface-container-low rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${c.influenceScore}%` }}
                              />
                            </div>
                            <span className="font-mono text-xs">
                              {c.influenceScore}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-mono text-xs font-medium">
                            {c.citations}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          {c.hasBrandReference ? (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                              Yes
                            </span>
                          ) : (
                            <span className="text-[10px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">
                              No
                            </span>
                          )}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td
                      colSpan={view === "url" ? 9 : 7}
                      className="py-12 text-center text-sm text-muted-foreground"
                    >
                      No citations found.
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
                Showing {items.length} of {data.total} citations
              </span>
              <span>
                Page {data.page} of{" "}
                {Math.max(1, Math.ceil(data.total / data.limit))}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
