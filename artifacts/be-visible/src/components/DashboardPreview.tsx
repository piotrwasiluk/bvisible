import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Quote,
  Heart,
  BarChart3,
  Info,
} from "lucide-react";

// ── Mock Data: Replit vs Competitors ─────────────────────────────────────────

const BRAND = "Replit";

const KPI_CARDS = [
  { label: "Mention Rate", value: "12.4%", change: "+4.2%", up: true },
  { label: "Share of Voice", value: "38.7%", change: "+8.1%", up: true },
  { label: "Citation Rate", value: "22.6%", change: "+6.3%", up: true },
  { label: "Sentiment", value: "91", change: "+3", up: true },
  { label: "Avg Position", value: "1.4", change: "-0.2", up: true },
];

const PLATFORMS = [
  { name: "Google AI Mode", rate: 28.5, color: "#4285f4" },
  { name: "ChatGPT", rate: 14.2, color: "#10a37f" },
  { name: "Gemini", rate: 11.8, color: "#886cff" },
  { name: "Perplexity", rate: 8.3, color: "#20808d" },
  { name: "Claude", rate: 5.1, color: "#d97706" },
];

const COMPETITORS = [
  { rank: 1, name: "Replit", value: "12.4%", change: "+4.2%", isYou: true },
  {
    rank: 2,
    name: "GitHub Codespaces",
    value: "10.8%",
    change: "-1.1%",
    isYou: false,
  },
  {
    rank: 3,
    name: "CodeSandbox",
    value: "7.2%",
    change: "+0.5%",
    isYou: false,
  },
  { rank: 4, name: "Stackblitz", value: "4.9%", change: "-0.3%", isYou: false },
  { rank: 5, name: "Gitpod", value: "3.1%", change: "+0.1%", isYou: false },
];

// 30-day time series data for the visibility chart
const VISIBILITY_SERIES = [
  5.2, 5.8, 6.1, 5.9, 6.5, 7.0, 6.8, 7.2, 7.8, 8.1, 8.4, 7.9, 8.6, 9.0, 9.2,
  8.8, 9.5, 10.1, 10.4, 10.8, 11.0, 10.6, 11.2, 11.5, 11.8, 12.0, 11.7, 12.1,
  12.4, 12.4,
];

const COMPETITOR_SERIES = [
  8.2, 8.5, 8.8, 9.0, 9.2, 9.5, 9.8, 10.0, 10.2, 10.5, 10.8, 11.0, 11.2, 11.0,
  10.8, 10.6, 10.8, 11.0, 10.9, 10.7, 10.5, 10.8, 10.6, 10.4, 10.5, 10.8, 10.7,
  10.9, 10.8, 10.8,
];

const DATES = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(2026, 2, i + 1);
  return `Mar ${d.getDate()}`;
});

type TabId = "overview" | "visibility" | "citations";

// ── Mini Sparkline SVG ───────────────────────────────────────────────────────

function Sparkline({
  data,
  color,
  width = 200,
  height = 48,
  animate = false,
}: {
  data: number[];
  color: string;
  width?: number;
  height?: number;
  animate?: boolean;
}) {
  const min = Math.min(...data) * 0.9;
  const max = Math.max(...data) * 1.1;
  const range = max - min || 1;
  const step = width / (data.length - 1);

  const points = data
    .map((v, i) => `${i * step},${height - ((v - min) / range) * height}`)
    .join(" ");

  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.polygon
        fill={`url(#grad-${color})`}
        initial={animate ? { opacity: 0 } : undefined}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        points={areaPoints}
      />
      <motion.polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        initial={animate ? { pathLength: 0, opacity: 0 } : undefined}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
    </svg>
  );
}

// ── Multi-Line Chart ─────────────────────────────────────────────────────────

function MultiLineChart({
  series,
  labels,
  width = 480,
  height = 140,
}: {
  series: { name: string; data: number[]; color: string }[];
  labels: string[];
  width?: number;
  height?: number;
}) {
  const allValues = series.flatMap((s) => s.data);
  const min = Math.min(...allValues) * 0.85;
  const max = Math.max(...allValues) * 1.1;
  const range = max - min || 1;
  const step = width / (labels.length - 1);

  return (
    <div>
      <svg width={width} height={height + 20} className="overflow-visible">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
          <line
            key={pct}
            x1={0}
            y1={height * (1 - pct)}
            x2={width}
            y2={height * (1 - pct)}
            stroke="#E2E2E3"
            strokeWidth="0.5"
          />
        ))}
        {/* Lines */}
        {series.map((s) => {
          const points = s.data
            .map(
              (v, i) => `${i * step},${height - ((v - min) / range) * height}`,
            )
            .join(" ");
          return (
            <motion.polyline
              key={s.name}
              fill="none"
              stroke={s.color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeOut" }}
            />
          );
        })}
        {/* X-axis labels */}
        {labels
          .filter((_, i) => i % 7 === 0)
          .map((label, idx) => (
            <text
              key={label}
              x={idx * 7 * step}
              y={height + 16}
              fontSize="9"
              fill="#999"
              textAnchor="middle"
              fontFamily="monospace"
            >
              {label}
            </text>
          ))}
      </svg>
      {/* Legend */}
      <div className="flex items-center gap-4 mt-2">
        {series.map((s) => (
          <div key={s.name} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: s.color }}
            />
            <span className="text-[10px] text-neutral-500">{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Tab: Overview ────────────────────────────────────────────────────────────

function OverviewTab() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-3 mb-5">
        {KPI_CARDS.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white p-3 rounded-lg border border-[#E2E2E3]/60"
          >
            <div className="flex items-center gap-1 mb-1.5">
              <span className="font-mono text-[8px] uppercase tracking-widest text-neutral-400">
                {card.label}
              </span>
            </div>
            <div className="text-xl font-bold tracking-tight">{card.value}</div>
            <div
              className={`flex items-center gap-0.5 text-[10px] font-bold mt-1 ${card.up ? "text-emerald-600" : "text-red-500"}`}
            >
              {card.up ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {card.change}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Two columns: Platform Bars + Competitor Leaderboard */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg border border-[#E2E2E3]/60">
          <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-3">
            Mention Rate by Platform
          </div>
          <div className="space-y-2.5">
            {PLATFORMS.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
              >
                <div className="flex justify-between text-[10px] mb-0.5">
                  <span className="font-medium text-neutral-700">{p.name}</span>
                  <span className="font-mono text-neutral-400">{p.rate}%</span>
                </div>
                <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: p.color }}
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(p.rate / PLATFORMS[0].rate) * 100}%`,
                    }}
                    transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-[#E2E2E3]/60">
          <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-3">
            Competitor Leaderboard
          </div>
          <div className="space-y-0">
            {COMPETITORS.map((c, i) => (
              <motion.div
                key={c.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className={`flex items-center gap-2 py-1.5 px-2 rounded ${c.isYou ? "bg-[#0F0F10]/[0.03]" : ""}`}
              >
                <span className="font-mono text-[10px] text-neutral-300 w-3">
                  {c.rank}
                </span>
                <span className="text-[11px] font-medium flex-1">
                  {c.name}
                  {c.isYou && (
                    <span className="ml-1.5 text-[8px] font-bold bg-[#0F0F10] text-white px-1 py-0.5 rounded">
                      YOU
                    </span>
                  )}
                </span>
                <span className="font-mono text-[11px] font-bold">
                  {c.value}
                </span>
                <span
                  className={`font-mono text-[9px] w-10 text-right ${c.change.startsWith("+") && c.change !== "+0.1%" ? "text-emerald-600" : "text-red-400"}`}
                >
                  {c.change}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Tab: Visibility ──────────────────────────────────────────────────────────

function VisibilityTab() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* KPI row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {KPI_CARDS.slice(0, 3).map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-3 rounded-lg border border-[#E2E2E3]/60"
          >
            <span className="font-mono text-[8px] uppercase tracking-widest text-neutral-400">
              {card.label}
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold">{card.value}</span>
              <span
                className={`text-[10px] font-bold ${card.up ? "text-emerald-600" : "text-red-500"}`}
              >
                {card.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Chart: Replit vs GitHub Codespaces over time */}
      <div className="bg-white p-4 rounded-lg border border-[#E2E2E3]/60">
        <div className="flex items-center justify-between mb-3">
          <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
            Mention Rate Over Time
          </div>
          <div className="text-[9px] text-neutral-400 font-mono">
            Last 30 days
          </div>
        </div>
        <MultiLineChart
          series={[
            { name: BRAND, data: VISIBILITY_SERIES, color: "#0F0F10" },
            {
              name: "GitHub Codespaces",
              data: COMPETITOR_SERIES,
              color: "#6366f1",
            },
          ]}
          labels={DATES}
        />
      </div>
    </motion.div>
  );
}

// ── Tab: Citations ───────────────────────────────────────────────────────────

const TOP_CITATIONS = [
  {
    rank: 1,
    domain: "docs.replit.com",
    pct: "8.2%",
    count: 412,
    type: "Owned",
  },
  { rank: 2, domain: "reddit.com", pct: "6.1%", count: 308, type: "Social" },
  {
    rank: 3,
    domain: "github.com",
    pct: "5.4%",
    count: 271,
    type: "Competitors",
  },
  { rank: 4, domain: "youtube.com", pct: "4.8%", count: 243, type: "Social" },
  {
    rank: 5,
    domain: "stackoverflow.com",
    pct: "3.9%",
    count: 198,
    type: "Educational",
  },
];

const DOMAIN_CATEGORIES = [
  { category: "Products", share: 42, color: "#14b8a6" },
  { category: "Social", share: 22, color: "#ec4899" },
  { category: "Educational", share: 15, color: "#10b981" },
  { category: "Owned", share: 12, color: "#3b82f6" },
  { category: "Other", share: 9, color: "#a3a3a3" },
];

function CitationsTab() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* KPI row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: "Citation Rate", value: "22.6%", change: "+6.3%", up: true },
          { label: "Citation Share", value: "4.1%", change: "+1.8%", up: true },
          { label: "Citations", value: "2,847", change: "+312", up: true },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-3 rounded-lg border border-[#E2E2E3]/60"
          >
            <span className="font-mono text-[8px] uppercase tracking-widest text-neutral-400">
              {card.label}
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold">{card.value}</span>
              <span className="text-[10px] font-bold text-emerald-600">
                {card.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Domain category bar */}
        <div className="bg-white p-4 rounded-lg border border-[#E2E2E3]/60">
          <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-3">
            Citation Sources
          </div>
          <div className="flex h-5 rounded-full overflow-hidden mb-3">
            {DOMAIN_CATEGORIES.map((cat) => (
              <motion.div
                key={cat.category}
                className="h-full"
                style={{ backgroundColor: cat.color }}
                initial={{ width: 0 }}
                animate={{ width: `${cat.share}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            {DOMAIN_CATEGORIES.map((cat) => (
              <div key={cat.category} className="flex items-center gap-1">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-[9px] text-neutral-500">
                  {cat.category} {cat.share}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top cited domains */}
        <div className="bg-white p-4 rounded-lg border border-[#E2E2E3]/60">
          <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-3">
            Top Cited Domains
          </div>
          <div className="space-y-1.5">
            {TOP_CITATIONS.map((c, i) => (
              <motion.div
                key={c.domain}
                initial={{ opacity: 0, x: 5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="flex items-center gap-2 text-[10px]"
              >
                <span className="font-mono text-neutral-300 w-3">{c.rank}</span>
                <span className="font-medium flex-1 truncate">{c.domain}</span>
                <span
                  className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                    c.type === "Owned"
                      ? "bg-blue-50 text-blue-700"
                      : c.type === "Social"
                        ? "bg-pink-50 text-pink-700"
                        : c.type === "Competitors"
                          ? "bg-red-50 text-red-700"
                          : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {c.type}
                </span>
                <span className="font-mono text-neutral-400 w-8 text-right">
                  {c.pct}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

export function DashboardPreview() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [autoPlay, setAutoPlay] = useState(true);

  // Auto-cycle through tabs
  useEffect(() => {
    if (!autoPlay) return undefined;
    const timer = setInterval(() => {
      setActiveTab((prev) => {
        if (prev === "overview") return "visibility";
        if (prev === "visibility") return "citations";
        return "overview";
      });
    }, 5000);
    return () => clearInterval(timer);
  }, [autoPlay]);

  const tabs: { id: TabId; label: string; icon: typeof Eye }[] = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "visibility", label: "Visibility", icon: Eye },
    { id: "citations", label: "Citations", icon: Quote },
  ];

  return (
    <div
      className="rounded-2xl bg-[#F6F6F7] border border-[#E2E2E3] overflow-hidden"
      style={{
        boxShadow:
          "0 0 0 1px rgba(0,0,0,0.05), 0 20px 50px -12px rgba(0,0,0,0.1)",
      }}
      onMouseEnter={() => setAutoPlay(false)}
      onMouseLeave={() => setAutoPlay(true)}
    >
      {/* Mock Browser Chrome */}
      <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-[#E2E2E3]">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
            <div className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
            <div className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
          </div>
          <div className="h-5 px-3 bg-neutral-50 border border-[#E2E2E3] rounded text-[10px] text-neutral-400 flex items-center font-mono">
            app.bvisible.ai/overview
          </div>
        </div>
        <div className="flex items-center gap-2">
          <img
            src="/images/bvisible-logo.svg"
            alt=""
            className="h-4 w-4 opacity-40"
          />
          <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-neutral-300">
            {BRAND}
          </span>
        </div>
      </div>

      {/* Dashboard Body */}
      <div className="p-5">
        {/* Tabs */}
        <div className="flex items-center gap-1 mb-5 bg-white rounded-lg p-1 border border-[#E2E2E3]/60 w-fit">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setAutoPlay(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-medium transition-all ${
                  isActive
                    ? "bg-[#0F0F10] text-white shadow-sm"
                    : "text-neutral-400 hover:text-neutral-600"
                }`}
              >
                <tab.icon className="w-3 h-3" />
                {tab.label}
              </button>
            );
          })}

          {/* Auto-play indicator */}
          <div className="ml-2 flex items-center gap-1">
            {autoPlay && (
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" && <OverviewTab key="overview" />}
          {activeTab === "visibility" && <VisibilityTab key="visibility" />}
          {activeTab === "citations" && <CitationsTab key="citations" />}
        </AnimatePresence>
      </div>
    </div>
  );
}
