import {
  TrendingUp,
  TrendingDown,
  Minus,
  Quote,
  Percent,
  Layers,
  Share2,
  FileText,
  BookOpen,
  MonitorPlay,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

const METRICS = [
  {
    label: "Total Citations",
    value: "1,284",
    delta: "+12.4%",
    sub: "vs last month",
    trend: "up",
    Icon: Quote,
  },
  {
    label: "Avg. Citation Rate",
    value: "64.2%",
    delta: "+2.1%",
    sub: "stable growth",
    trend: "up",
    Icon: Percent,
  },
  {
    label: "Top Asset Coverage",
    value: "88.1%",
    delta: "−4.2%",
    sub: "action required",
    trend: "down",
    Icon: Layers,
  },
  {
    label: "Model Diversity Score",
    value: "0.92",
    delta: "Stable",
    sub: "across all engines",
    trend: "neutral",
    Icon: Share2,
  },
];

const MODELS = [
  { name: "GPT-4o (OpenAI)", citations: 482, bar: 78, opacity: "opacity-100" },
  { name: "Claude 3.5 Sonnet (Anthropic)", citations: 312, bar: 62, opacity: "opacity-80" },
  { name: "Gemini 1.5 Pro (Google)", citations: 294, bar: 58, opacity: "opacity-60" },
  { name: "Perplexity (Sonar)", citations: 196, bar: 40, opacity: "opacity-40" },
];

const FORMATS = [
  {
    label: "Technical Whitepapers",
    barWidth: 85,
    barColor: "bg-emerald-500",
    status: "Winning",
    statusColor: "text-emerald-600",
    Icon: FileText,
  },
  {
    label: "Blog Series",
    barWidth: 45,
    barColor: "bg-neutral-500",
    status: "Tied",
    statusColor: "text-muted-foreground",
    Icon: BookOpen,
  },
  {
    label: "Product Explainer",
    barWidth: 15,
    barColor: "bg-destructive",
    status: "Losing",
    statusColor: "text-destructive",
    Icon: MonitorPlay,
  },
];

const ASSETS = [
  {
    title: "2024 AI Market Expansion Report",
    path: "/insights/ai-market-2024",
    topic: "Market Analysis",
    freq: 342,
    model: "GPT-4o",
    status: "Optimized",
    statusClass: "bg-emerald-100 text-emerald-800",
  },
  {
    title: "Vector Database Integration Guide",
    path: "/docs/vector-integration",
    topic: "Engineering",
    freq: 218,
    model: "Claude 3.5",
    status: "Improving",
    statusClass: "bg-blue-100 text-blue-800",
  },
  {
    title: "Security Protocols for LLM Agents",
    path: "/security/llm-protocols",
    topic: "Cybersecurity",
    freq: 94,
    model: "Gemini 1.5",
    status: "Gap",
    statusClass: "bg-amber-100 text-amber-800",
  },
];

const GAP_ITEMS = [
  {
    title: "Multi-modal Token Economics",
    meta: "Priority: High · Search Vol: 12k/mo",
  },
  {
    title: "Enterprise SSO Best Practices",
    meta: "Priority: Med · Search Vol: 45k/mo",
  },
];

export default function CitationsPage() {
  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-8">
      {/* Metric Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {METRICS.map((m) => (
          <div
            key={m.label}
            className="bg-white p-5 rounded border border-neutral-200/40 flex flex-col justify-between h-32"
          >
            <div className="flex justify-between items-start">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {m.label}
              </span>
              <m.Icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="mt-2">
              <h2 className="text-3xl font-black tracking-tight">{m.value}</h2>
              <p
                className={`text-[11px] font-bold mt-1 flex items-center gap-1 ${
                  m.trend === "up"
                    ? "text-emerald-600"
                    : m.trend === "down"
                    ? "text-destructive"
                    : "text-muted-foreground"
                }`}
              >
                {m.trend === "up" ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : m.trend === "down" ? (
                  <TrendingDown className="w-3.5 h-3.5" />
                ) : (
                  <Minus className="w-3.5 h-3.5" />
                )}
                {m.delta}{" "}
                <span className="text-muted-foreground font-normal tracking-normal ml-1">
                  {m.sub}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Middle Row: Distribution + Formats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Citation Distribution by Model */}
        <div className="lg:col-span-2 bg-surface-container-low p-6 rounded border border-neutral-200/40">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold tracking-tight uppercase">
              Citation Distribution by Model
            </h3>
            <button className="font-mono text-[9px] uppercase tracking-widest bg-neutral-200/60 px-2 py-1 rounded hover:bg-neutral-200 transition-colors">
              Export CSV
            </button>
          </div>
          <div className="space-y-6">
            {MODELS.map((m) => (
              <div key={m.name} className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold">{m.name}</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {m.citations} Citations
                  </span>
                </div>
                <div className="h-2 w-full bg-neutral-200/60 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-primary ${m.opacity} transition-all duration-500`}
                    style={{ width: `${m.bar}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Winning Formats */}
        <div className="bg-white p-6 rounded border border-neutral-200/40 flex flex-col">
          <h3 className="text-sm font-bold tracking-tight uppercase mb-6">
            Winning Formats
          </h3>
          <div className="flex-1 flex flex-col justify-around gap-4">
            {FORMATS.map((f) => (
              <div key={f.label} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center shrink-0">
                  <f.Icon className="w-5 h-5 text-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold">{f.label}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex-1 h-1 bg-neutral-200/60 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${f.barColor} transition-all duration-500`}
                        style={{ width: `${f.barWidth}%` }}
                      />
                    </div>
                    <span
                      className={`font-mono text-[9px] uppercase tracking-widest font-bold shrink-0 ${f.statusColor}`}
                    >
                      {f.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performing Assets Table */}
      <div className="bg-white rounded border border-neutral-200/40 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200/40 bg-surface-container-low flex justify-between items-center">
          <h3 className="text-sm font-bold tracking-tight uppercase">
            Top Performing Assets
          </h3>
          <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
            Last updated: 14m ago
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200/30">
                <th className="px-6 py-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-normal">
                  Resource Title
                </th>
                <th className="px-6 py-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-normal">
                  Topic
                </th>
                <th className="px-6 py-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-normal">
                  Citation Freq
                </th>
                <th className="px-6 py-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-normal">
                  Primary Model
                </th>
                <th className="px-6 py-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-normal">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200/30">
              {ASSETS.map((a) => (
                <tr
                  key={a.title}
                  className="hover:bg-surface-container-low/60 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold truncate max-w-xs">
                        {a.title}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono mt-0.5">
                        {a.path}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-neutral-100 px-2 py-1 rounded text-[10px] font-mono">
                      {a.topic}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold">{a.freq}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {a.model}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${a.statusClass}`}
                    >
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Citation Opportunity Gap */}
      <div className="bg-red-50/60 border border-red-200/50 p-6 rounded-lg">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded bg-red-100 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-destructive uppercase tracking-tight">
              Citation Opportunity Gap Detected
            </h3>
            <p className="text-sm text-foreground/70 mt-1">
              High-intent topics with zero citation frequency in current model
              training windows.
            </p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              {GAP_ITEMS.map((g) => (
                <div
                  key={g.title}
                  className="bg-white p-3 rounded border border-red-200/30 flex justify-between items-center"
                >
                  <div>
                    <p className="text-xs font-bold">{g.title}</p>
                    <p className="font-mono text-[8px] uppercase tracking-widest mt-1 text-muted-foreground">
                      {g.meta}
                    </p>
                  </div>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-destructive font-bold">
                    Missing
                  </span>
                </div>
              ))}
            </div>
            <button className="mt-4 text-xs font-bold flex items-center gap-1 hover:underline text-destructive transition-colors">
              Generate Optimization Prompts
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
