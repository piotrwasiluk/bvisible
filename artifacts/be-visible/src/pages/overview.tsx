import {
  Info,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Loader2,
} from "lucide-react";
import { useGetOverview } from "@workspace/api-client-react";
import { useGlobalFilters } from "@/hooks/use-global-filters";

export default function OverviewPage() {
  const { filterParams } = useGlobalFilters();
  const { data, isLoading, isError } = useGetOverview(filterParams);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const maxPlatformRate = Math.max(
    ...(data?.platforms?.map((p) => p.rate) ?? [1]),
  );

  const youRank = data?.competitors?.find((c) => c.isYou);

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Executive snapshot of brand health across all AI search dimensions.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
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
              </div>
              <div
                className={`flex items-center gap-1 mt-2 text-xs font-bold ${
                  positive ? "text-emerald-600" : "text-destructive"
                }`}
              >
                {positive ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5" />
                )}
                {card.change}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom: Platform bars + Competitor leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mention Rate by Platform */}
        <div className="bg-surface-container-lowest p-6 rounded-xl ring-1 ring-black/[0.03]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold">Mention Rate by Platform</h3>
          </div>
          <div className="space-y-4">
            {(data?.platforms ?? []).map((platform) => (
              <div key={platform.platform}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-medium">{platform.platform}</span>
                  <span className="font-mono text-muted-foreground">
                    {platform.rate}%
                  </span>
                </div>
                <div className="h-2.5 w-full bg-surface-container-low rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{
                      width: `${(platform.rate / maxPlatformRate) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mention Rate by Competitor */}
        <div className="bg-surface-container-lowest p-6 rounded-xl ring-1 ring-black/[0.03]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold">Mention Rate by Competitor</h3>
          </div>

          {/* Rank Badge */}
          {youRank && (
            <div className="flex items-center gap-3 mb-6 p-4 bg-surface-container-low rounded-lg">
              <span className="text-4xl font-black tracking-tighter">
                {youRank.rank === 1
                  ? "1st"
                  : youRank.rank === 2
                    ? "2nd"
                    : youRank.rank === 3
                      ? "3rd"
                      : `${youRank.rank}th`}
              </span>
            </div>
          )}

          {/* Leaderboard */}
          <div className="space-y-0">
            {(data?.competitors ?? []).map((c) => {
              const positive = c.change.startsWith("+") && c.change !== "+0.0%";
              return (
                <div
                  key={c.name}
                  className={`flex items-center gap-3 py-3 px-3 rounded-lg ${
                    c.isYou ? "bg-primary/5" : ""
                  }`}
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
                    className={`font-mono text-[11px] w-12 text-right ${
                      positive ? "text-emerald-600" : "text-destructive"
                    }`}
                  >
                    {c.change}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
