import { Info, TrendingUp, ExternalLink, Loader2 } from "lucide-react";
import { useGetCommunity } from "@workspace/api-client-react";
import { useGlobalFilters } from "@/hooks/use-global-filters";

function KpiCard({
  label,
  value,
  change,
  positive,
}: {
  label: string;
  value: string;
  change: string;
  positive: boolean;
}) {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl ring-1 ring-black/[0.03]">
      <div className="flex items-center gap-1.5 mb-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
        <Info className="w-3 h-3 text-muted-foreground/50" />
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight">{value}</span>
        <span
          className={`text-xs font-bold ${positive ? "text-emerald-600" : "text-destructive"}`}
        >
          {positive ? "\u2197" : "\u2198"} {change}
        </span>
      </div>
    </div>
  );
}

export default function CommunityPage() {
  const { filterParams } = useGlobalFilters();
  const { data, isLoading, isError } = useGetCommunity(filterParams);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const maxRate = Math.max(...(data?.subreddits ?? []).map((s) => s.rate), 1);

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">Community</h1>
        <p className="text-sm text-muted-foreground">
          Track brand presence within community platforms that AI models
          frequently cite.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(data?.kpis ?? []).map((card) => (
          <KpiCard
            key={card.label}
            label={card.label}
            value={card.value}
            change={card.change}
            positive={card.trend === "up"}
          />
        ))}
      </div>

      {/* Two-column: Subreddit bars + Top URLs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Citation Rate by Subreddit */}
        <div className="bg-surface-container-lowest p-6 rounded-xl ring-1 ring-black/[0.03]">
          <h3 className="text-sm font-bold mb-1">Citation Rate by Subreddit</h3>
          <p className="text-xs text-muted-foreground mb-6">
            How often each subreddit is cited in AI responses
          </p>
          <div className="space-y-4">
            {(data?.subreddits ?? []).map((sub) => (
              <div key={sub.name}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-medium">{sub.name}</span>
                  <span className="font-mono text-muted-foreground">
                    {sub.rate}%
                  </span>
                </div>
                <div className="h-2 w-full bg-surface-container-low rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 rounded-full transition-all"
                    style={{ width: `${(sub.rate / maxRate) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Reddit URLs */}
        <div className="bg-surface-container-lowest p-6 rounded-xl ring-1 ring-black/[0.03]">
          <h3 className="text-sm font-bold mb-1">Top Reddit URLs</h3>
          <p className="text-xs text-muted-foreground mb-6">
            Most-cited Reddit threads in AI responses
          </p>
          <div className="space-y-3">
            {(data?.topUrls ?? []).map((item) => (
              <div
                key={item.url}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-container-low transition-colors"
              >
                <span className="font-mono text-xs text-muted-foreground w-5 shrink-0 pt-0.5">
                  {item.rank}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate flex items-center gap-1">
                    {item.url}
                    <ExternalLink className="w-3 h-3 text-muted-foreground shrink-0" />
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {item.citations} citations
                    </span>
                    <span className="font-mono text-[10px] text-emerald-600 flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" />
                      {item.change}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
