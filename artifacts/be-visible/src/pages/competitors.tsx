import {
  TrendingUp,
  TrendingDown,
  Minus,
  Zap,
  Cpu,
  Hexagon,
  CircleDot,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Download,
} from "lucide-react";

const BENTO_METRICS = [
  {
    id: "position",
    label: "Overall Position",
    liveTag: true,
    value: "WINNING",
    desc: "Dominating 64% of high-intent search vectors across core categories.",
    valueClass: "text-3xl font-extrabold tracking-tighter",
    accent: "text-emerald-500",
    bg: "bg-white border border-neutral-200/40",
    TrendIcon: TrendingUp,
    trendColor: "text-emerald-500",
  },
];

const VISIBILITY_CHANNELS = [
  { label: "LLM Search (GPT/Bing)", pct: 94, barColor: "bg-primary" },
  { label: "Social Listening", pct: 72, barColor: "bg-neutral-500" },
  { label: "Vertical Directories", pct: 81, barColor: "bg-neutral-500" },
];

const COMPETITORS = [
  {
    name: "bVisible (Brand)",
    tag: "YOUR DOMAIN",
    IconEl: Zap,
    iconBg: "bg-primary",
    iconColor: "text-primary-foreground",
    isBrand: true,
    visibility: "88.4%",
    citFreq: "1.4k / wk",
    promptCov: "92.0%",
    leadership: "WINNING",
    leaderClass: "text-emerald-600 bg-emerald-50",
    TrendIcon: TrendingUp,
    trendColor: "text-emerald-500",
    bold: true,
  },
  {
    name: "Competitor A",
    tag: "DIRECT RIVAL",
    IconEl: Cpu,
    iconBg: "bg-neutral-100 border border-neutral-200/50",
    iconColor: "text-neutral-400",
    isBrand: false,
    visibility: "74.2%",
    citFreq: "0.9k / wk",
    promptCov: "81.5%",
    leadership: "LOSING",
    leaderClass: "text-neutral-400 bg-neutral-100",
    TrendIcon: TrendingDown,
    trendColor: "text-destructive",
    bold: false,
  },
  {
    name: "Competitor B",
    tag: "EMERGING",
    IconEl: Hexagon,
    iconBg: "bg-neutral-100 border border-neutral-200/50",
    iconColor: "text-neutral-400",
    isBrand: false,
    visibility: "82.1%",
    citFreq: "1.1k / wk",
    promptCov: "88.2%",
    leadership: "TIED",
    leaderClass: "text-orange-600 bg-orange-50",
    TrendIcon: Minus,
    trendColor: "text-neutral-400",
    bold: false,
  },
  {
    name: "Competitor C",
    tag: "ESTABLISHED",
    IconEl: CircleDot,
    iconBg: "bg-neutral-100 border border-neutral-200/50",
    iconColor: "text-neutral-400",
    isBrand: false,
    visibility: "61.9%",
    citFreq: "0.6k / wk",
    promptCov: "54.0%",
    leadership: "LOSING",
    leaderClass: "text-neutral-400 bg-neutral-100",
    TrendIcon: Minus,
    trendColor: "text-neutral-400",
    bold: false,
  },
];

const CRITICAL_GAPS = [
  {
    Icon: AlertTriangle,
    iconColor: "text-amber-500",
    title: 'Competitor B parity in "DevOps Tools"',
    desc: "Citation density gap is narrowing within the last 48 hours.",
    warning: true,
  },
  {
    Icon: CheckCircle2,
    iconColor: "text-emerald-500",
    title: '100% Coverage on "Scalability" Prompts',
    desc: "Maintained leadership despite Competitor A content offensive.",
    warning: false,
  },
];

export default function CompetitorsPage() {
  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-8">
      {/* Summary Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Overall Position */}
        <div className="bg-white p-6 rounded-lg border border-neutral-200/40 flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Overall Position
            </span>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(34,197,94,0.4)] animate-pulse" />
              <span className="font-mono text-[10px] uppercase tracking-widest">
                LIVE
              </span>
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold tracking-tighter">
              WINNING
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-500 shrink-0" />
          </div>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            Dominating 64% of high-intent search vectors across core categories.
          </p>
        </div>

        {/* Visibility Score */}
        <div className="bg-surface-container-low p-6 rounded-lg flex flex-col gap-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Visibility Score
          </span>
          <div className="mt-2">
            <span className="text-3xl font-bold tracking-tighter">88.4</span>
            <span className="font-mono text-xs text-muted-foreground ml-1">
              /100
            </span>
          </div>
          <div className="w-full h-1 bg-neutral-200 mt-4 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: "88.4%" }} />
          </div>
        </div>

        {/* Prompt Coverage */}
        <div className="bg-surface-container-low p-6 rounded-lg flex flex-col gap-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Prompt Coverage
          </span>
          <div className="mt-2">
            <span className="text-3xl font-bold tracking-tighter">92%</span>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-neutral-200/50">
              +4.2% MoM
            </span>
          </div>
        </div>

        {/* Direct Competitors */}
        <div className="bg-surface-container-low p-6 rounded-lg flex flex-col gap-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Direct Competitors
          </span>
          <div className="flex -space-x-2 mt-4">
            {["A", "B", "C"].map((letter, i) => (
              <div
                key={letter}
                className={`w-8 h-8 rounded-full border-2 border-surface-container-low flex items-center justify-center font-bold text-xs text-white ${
                  i === 0
                    ? "bg-neutral-400"
                    : i === 1
                    ? "bg-neutral-500"
                    : "bg-neutral-600"
                }`}
              >
                {letter}
              </div>
            ))}
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest mt-2">
            3 Active Audits
          </span>
        </div>
      </div>

      {/* Technical Comparison Table */}
      <section className="bg-white rounded-lg border border-neutral-200/40 overflow-hidden flex flex-col">
        <div className="p-6 border-b border-neutral-100 flex justify-between items-center bg-surface-container-low">
          <div className="flex items-center gap-4">
            <h2 className="font-bold text-lg tracking-tight">
              Technical Comparison
            </h2>
            <span className="font-mono text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded uppercase tracking-widest">
              Q3 2023
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-xs font-medium border border-neutral-200/60 rounded hover:bg-neutral-50 transition-colors flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" />
              Filter
            </button>
            <button className="px-3 py-1.5 text-xs font-medium border border-neutral-200/60 rounded hover:bg-neutral-50 transition-colors flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low">
              <tr>
                {["Entity", "Visibility", "Citation Freq", "Prompt Cov", "Category Leadership", "Trend"].map(
                  (col, i) => (
                    <th
                      key={col}
                      className={`p-6 font-mono text-[11px] uppercase tracking-widest text-muted-foreground border-b border-neutral-100 font-normal ${
                        i > 0 && i < 5 ? "text-center" : i === 5 ? "text-right" : ""
                      }`}
                    >
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50/80">
              {COMPETITORS.map((c) => (
                <tr
                  key={c.name}
                  className={`hover:bg-neutral-50 transition-colors ${
                    c.isBrand ? "bg-surface-container-low/40" : ""
                  }`}
                >
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${c.iconBg}`}
                      >
                        <c.IconEl className={`w-[18px] h-[18px] ${c.iconColor}`} />
                      </div>
                      <div className="flex flex-col">
                        <span
                          className={`text-sm tracking-tight ${
                            c.bold ? "font-bold" : "font-medium text-neutral-700"
                          }`}
                        >
                          {c.name}
                        </span>
                        <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                          {c.tag}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <span className={`font-mono text-sm ${c.bold ? "font-bold" : ""}`}>
                      {c.visibility}
                    </span>
                  </td>
                  <td className="p-6 text-center">
                    <span className="font-mono text-sm">{c.citFreq}</span>
                  </td>
                  <td className="p-6 text-center">
                    <span className="font-mono text-sm">{c.promptCov}</span>
                  </td>
                  <td className="p-6 text-center">
                    <span
                      className={`font-mono text-[10px] px-2 py-0.5 rounded font-bold uppercase ${c.leaderClass}`}
                    >
                      {c.leadership}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <c.TrendIcon className={`w-5 h-5 inline-block ${c.trendColor}`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Detail Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Visibility Breakdown */}
        <div className="flex flex-col gap-4">
          <h3 className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground font-bold">
            Visibility Breakdown
          </h3>
          <div className="bg-white p-6 rounded-lg border border-neutral-200/40 flex flex-col gap-6">
            {VISIBILITY_CHANNELS.map((ch) => (
              <div key={ch.label} className="flex flex-col gap-2">
                <div className="flex justify-between items-center font-mono text-[10px] uppercase tracking-widest">
                  <span>{ch.label}</span>
                  <span className="font-bold">{ch.pct}%</span>
                </div>
                <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className={`${ch.barColor} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${ch.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Gaps */}
        <div className="flex flex-col gap-4">
          <h3 className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground font-bold">
            Critical Gaps
          </h3>
          <div className="flex flex-col gap-3">
            {CRITICAL_GAPS.map((gap) => (
              <div
                key={gap.title}
                className="bg-surface-container-low p-4 rounded-lg flex gap-4 items-start"
              >
                <gap.Icon className={`w-5 h-5 shrink-0 mt-0.5 ${gap.iconColor}`} />
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold tracking-tight">
                    {gap.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {gap.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
