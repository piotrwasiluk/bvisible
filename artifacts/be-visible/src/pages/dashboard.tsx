import { Sparkles, AlertTriangle, Network } from "lucide-react";

const MODELS = [
  {
    name: "GPT-4o",
    prominence: 88,
    color: "text-emerald-600",
    positive: 62,
    neutral: 26,
  },
  {
    name: "Claude 3.5 Sonnet",
    prominence: 74,
    color: "text-emerald-600",
    positive: 51,
    neutral: 23,
  },
  {
    name: "Gemini 1.5 Pro",
    prominence: 42,
    color: "text-amber-500",
    positive: 12,
    neutral: 30,
  },
  {
    name: "Llama 3 (70B)",
    prominence: 18,
    color: "text-destructive",
    positive: 4,
    neutral: 14,
  },
];

const BAR_HEIGHTS = [20, 25, 32, 28, 45, 55, 50, 62, 75, 82, 68, 72, 88, 95, 80];
const BAR_DATES = ["01 Oct", "15 Oct", "Today"];
const HIGHLIGHTED = [5, 9, 13];

function MetricStrip() {
  const metrics = [
    {
      label: "Brand Appearance",
      value: "42%",
      delta: "+4.2%",
      up: true,
      sub: "Historical Baseline: 37.8%",
    },
    {
      label: "Citation Frequency",
      value: "28%",
      delta: "−1.5%",
      up: false,
      sub: "Competitor Avg: 22%",
    },
    {
      label: "Prompt Coverage",
      value: "65%",
      delta: "+12%",
      up: true,
      sub: "Expansion: Active",
    },
    {
      label: "Deltas (24h)",
      value: "+1.2",
      delta: "INDEX",
      up: null,
      sub: "Market Volatility: Low",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 mb-12 bg-surface-container-low rounded-lg overflow-hidden">
      {metrics.map((m, i) => (
        <div
          key={m.label}
          className={`p-6 ${i < metrics.length - 1 ? "border-r border-neutral-200/50" : ""}`}
        >
          <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mb-1">
            {m.label}
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold tracking-tight">{m.value}</span>
            {m.up === null ? (
              <span className="text-[11px] font-mono text-neutral-400">{m.delta}</span>
            ) : (
              <span
                className={`text-[11px] font-mono font-bold flex items-center gap-0.5 ${
                  m.up ? "text-emerald-600" : "text-destructive"
                }`}
              >
                {m.up ? "↑" : "↓"} {m.delta}
              </span>
            )}
          </div>
          <div className="text-[10px] text-neutral-400 mt-2">{m.sub}</div>
        </div>
      ))}
    </div>
  );
}

function ModelProminenceMatrix() {
  return (
    <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest p-8 rounded-xl ring-1 ring-black/[0.03]">
      <div className="flex justify-between items-start mb-10">
        <div>
          <h3 className="text-lg font-bold tracking-tight">Model Prominence Matrix</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Relative brand mention probability per 1,000 queries.
          </p>
        </div>
        <button className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 transition-colors rounded font-mono text-[10px] uppercase tracking-wider">
          Export CSV
        </button>
      </div>

      <div className="space-y-6">
        {MODELS.map((model) => (
          <div key={model.name}>
            <div className="flex justify-between text-[11px] font-mono mb-2 uppercase tracking-tighter">
              <span>{model.name}</span>
              <span className={`font-bold ${model.color}`}>{model.prominence}% Prominence</span>
            </div>
            <div className="h-3 w-full bg-surface-container-low rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-700"
                style={{ width: `${model.prominence}%` }}
              />
            </div>
            <div className="flex gap-4 mt-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-mono uppercase text-neutral-500">
                  Positive: {model.positive}%
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-neutral-300" />
                <span className="text-[10px] font-mono uppercase text-neutral-500">
                  Neutral: {model.neutral}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NarrativeFraming() {
  const framings = [
    { label: "Positive Framing", value: "58.4%", color: "bg-emerald-400" },
    { label: "Neutral Reference", value: "32.1%", color: "bg-neutral-400" },
    { label: "Omission Rate", value: "9.5%", color: "bg-red-500" },
  ];

  return (
    <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
      <div className="bg-primary text-primary-foreground p-8 rounded-xl h-full flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold tracking-tight mb-2">Narrative Framing</h3>
          <p className="text-[11px] opacity-60 mb-8">
            How models categorize your value proposition.
          </p>
          <div className="space-y-6">
            {framings.map((f) => (
              <div key={f.label} className="flex items-center gap-4">
                <div className={`h-12 w-1.5 rounded-full ${f.color} shrink-0`} />
                <div>
                  <div className="font-mono text-[10px] uppercase opacity-60 mb-0.5">
                    {f.label}
                  </div>
                  <div className="text-xl font-bold">{f.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/10">
          <div className="font-mono text-[9px] uppercase tracking-widest opacity-50 mb-2">
            Primary Sentiment Driver
          </div>
          <div className="text-sm font-medium leading-relaxed">
            "Market Leader in AI Observability"
          </div>
        </div>
      </div>
    </div>
  );
}

function InsightCards() {
  const insights = [
    {
      icon: Sparkles,
      badge: "RISING",
      badgeColor: "text-emerald-600 bg-emerald-50",
      title: "Technical Authority",
      body: "Systematic citation increase in technical benchmarks across Claude and GPT-4 families.",
    },
    {
      icon: AlertTriangle,
      badge: "FALLING",
      badgeColor: "text-destructive bg-red-50",
      title: "Consumer Trust",
      body: "Minor decrease in Gemini visibility relating to 'Ease of Use' keyword clusters.",
    },
    {
      icon: Network,
      badge: "STABLE",
      badgeColor: "text-neutral-500 bg-neutral-100",
      title: "Market Share Correlation",
      body: "Visibility is currently maintaining a +0.8 correlation with direct organic search traffic.",
    },
  ];

  return (
    <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
      {insights.map(({ icon: Icon, badge, badgeColor, title, body }) => (
        <div
          key={title}
          className="bg-surface-container-low p-6 rounded-xl border border-transparent hover:border-border/30 transition-colors"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-white rounded shadow-sm">
              <Icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
            </div>
            <span className={`font-mono text-[10px] px-2 py-0.5 rounded ${badgeColor}`}>
              {badge}
            </span>
          </div>
          <h4 className="font-bold text-sm uppercase tracking-tight mb-2">{title}</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">{body}</p>
        </div>
      ))}
    </div>
  );
}

function DeltaTrajectory() {
  return (
    <div className="col-span-12 bg-surface-container-lowest rounded-xl p-8 ring-1 ring-black/[0.03]">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-bold tracking-tight">Delta Trajectory (30D)</h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-sm bg-primary" />
            <span className="font-mono text-[9px] uppercase text-neutral-400">Highlighted</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-sm bg-neutral-200" />
            <span className="font-mono text-[9px] uppercase text-neutral-400">Base</span>
          </div>
        </div>
      </div>
      <div className="h-48 w-full flex items-end gap-1.5 px-2 border-b border-l border-neutral-100">
        {BAR_HEIGHTS.map((h, i) => (
          <div
            key={i}
            className={`flex-1 rounded-t-sm transition-colors group relative ${
              HIGHLIGHTED.includes(i)
                ? "bg-primary"
                : "bg-neutral-100 hover:bg-primary/30"
            }`}
            style={{ height: `${h}%` }}
          >
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-mono text-neutral-400 hidden group-hover:block whitespace-nowrap">
              {h}
            </span>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-4 font-mono text-[10px] text-neutral-400 uppercase tracking-widest px-2">
        {BAR_DATES.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="p-8 overflow-y-auto">
      {/* Headline */}
      <div className="mb-12 max-w-5xl">
        <div className="flex items-baseline gap-4 mb-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            System Status: Active
          </span>
          <span className="text-[10px] font-mono text-neutral-400">ID: VIS-992-ALPHA</span>
        </div>
        <h1 className="text-5xl font-black tracking-tighter leading-none mb-4">
          Mission Control
        </h1>
        <p className="text-muted-foreground max-w-2xl font-medium">
          Global AI visibility across 14 large language models. Analyzing 4.2M prompt interactions
          for Brand Authority.
        </p>
      </div>

      {/* Metric Strip */}
      <MetricStrip />

      {/* Bento Grid */}
      <div className="grid grid-cols-12 gap-6 mb-6">
        <ModelProminenceMatrix />
        <NarrativeFraming />
        <InsightCards />
        <DeltaTrajectory />
      </div>
    </div>
  );
}
