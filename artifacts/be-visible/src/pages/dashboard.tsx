import { BarChart3, TrendingUp, Search, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

function MetricCard({ title, value, change, trend, subtitle }: { title: string, value: string, change: string, trend: "up" | "down" | "neutral", subtitle: string }) {
  return (
    <div className="p-6 border-r border-border/50 last:border-r-0">
      <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">{title}</div>
      <div className="flex items-baseline gap-3 mb-2">
        <span className="text-4xl font-black tracking-tighter">{value}</span>
        {trend !== "neutral" && (
          <span className={`text-xs font-mono font-bold flex items-center gap-0.5 ${trend === 'up' ? 'text-emerald-600' : 'text-destructive'}`}>
            {trend === 'up' ? '↑' : '↓'} {change}
          </span>
        )}
      </div>
      <div className="text-[11px] text-muted-foreground font-medium">{subtitle}</div>
    </div>
  );
}

export default function DashboardPage() {
  // In a real app we'd fetch data here. For now it's an empty state with metrics.
  const hasData = false;

  return (
    <div className="p-8">
      <div className="mb-10 max-w-5xl">
        <div className="flex items-baseline gap-4 mb-3">
          <span className="font-mono font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground">System Status: Active</span>
          <span className="font-mono text-[10px] text-muted-foreground/60">ID: VIS-992-ALPHA</span>
        </div>
        <h1 className="text-5xl font-black tracking-tighter leading-none mb-4 text-foreground">Mission Control</h1>
        <p className="text-muted-foreground max-w-2xl text-lg">
          Global AI visibility across 14 large language models. Analyzing prompt interactions for Brand Authority.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 bg-surface-container-low rounded-xl overflow-hidden ring-1 ring-border/50 mb-10">
        <MetricCard 
          title="Brand Appearance" 
          value="--" 
          change="0%" 
          trend="neutral" 
          subtitle="Awaiting Audit" 
        />
        <MetricCard 
          title="Citation Frequency" 
          value="--" 
          change="0%" 
          trend="neutral" 
          subtitle="Awaiting Audit" 
        />
        <MetricCard 
          title="Prompt Coverage" 
          value="--" 
          change="0%" 
          trend="neutral" 
          subtitle="Awaiting Audit" 
        />
        <MetricCard 
          title="Deltas (24h)" 
          value="--" 
          change="" 
          trend="neutral" 
          subtitle="Market Volatility: N/A" 
        />
      </div>

      {!hasData && (
        <div className="h-[400px] border border-dashed border-border/80 rounded-xl flex flex-col items-center justify-center text-center bg-surface-container-lowest relative overflow-hidden group">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-surface-container-low to-transparent opacity-50"></div>
          
          <div className="z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-surface border border-border/50 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <Search className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold tracking-tight mb-2">No visibility data yet</h3>
            <p className="text-muted-foreground max-w-sm mb-8 text-sm leading-relaxed">
              Your workspace is configured and ready. Run your first audit to start extracting brand visibility signals from major AI models.
            </p>
            <Button size="lg" className="font-mono uppercase tracking-widest text-xs" onClick={() => console.log('Run audit clicked')}>
              Initialize Audit Pipeline
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
