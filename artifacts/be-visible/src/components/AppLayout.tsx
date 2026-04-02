import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Eye,
  Quote,
  MessageCircle,
  Heart,
  FileText,
  TerminalSquare,
  Link2,
  Lightbulb,
  ClipboardList,
  Settings,
  HelpCircle,
  Search,
  Bell,
  Calendar,
  Globe,
  ChevronDown,
  X,
  Filter,
} from "lucide-react";
import { useWorkspaceConfig } from "@/hooks/use-workspace";
import {
  useGlobalFilters,
  type GlobalFilters,
} from "@/hooks/use-global-filters";
import { useGetFilterOptions } from "@workspace/api-client-react";

const ANALYTICS_NAV = [
  { href: "/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/visibility", label: "Visibility", icon: Eye },
  { href: "/citations-analytics", label: "Citations", icon: Quote },
  { href: "/community", label: "Community", icon: MessageCircle },
  { href: "/sentiment", label: "Sentiment", icon: Heart },
];

const DATA_NAV = [
  { href: "/prompts", label: "Prompts", icon: TerminalSquare },
  { href: "/pages", label: "Pages", icon: FileText },
  { href: "/citations-detail", label: "Citations Detail", icon: Link2 },
];

const ACTIONS_NAV = [
  { href: "/opportunities", label: "Opportunities", icon: Lightbulb },
  { href: "/reports", label: "Reports", icon: ClipboardList },
];

const DATE_RANGE_OPTIONS = [
  { value: "7d", label: "Last 7 days" },
  { value: "14d", label: "Last 14 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
];

function NavSection({
  label,
  items,
  location,
  workspaceQuery,
}: {
  label: string;
  items: typeof ANALYTICS_NAV;
  location: string;
  workspaceQuery: string;
}) {
  return (
    <div className="mb-6">
      <div className="px-3 mb-2 font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground/60 font-bold">
        {label}
      </div>
      <div className="flex flex-col gap-0.5">
        {items.map((item) => {
          const isActive = location === item.href;
          const href = workspaceQuery
            ? `${item.href}?${workspaceQuery}`
            : item.href;
          return (
            <Link
              key={item.href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-surface-container-lowest text-foreground shadow-sm ring-1 ring-black/[0.03]"
                  : "text-muted-foreground hover:text-foreground hover:bg-border/20",
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function FilterDropdown({
  label,
  icon: Icon,
  value,
  options,
  onChange,
  onClear,
}: {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  onClear?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const displayLabel = value || label;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-lg transition-colors whitespace-nowrap",
          value
            ? "bg-primary/10 border-primary/20 text-primary"
            : "border-border/60 hover:bg-muted/50",
        )}
      >
        {Icon && <Icon className="w-3.5 h-3.5" />}
        {displayLabel}
        {value && onClear ? (
          <span
            className="ml-1 hover:text-destructive cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
          >
            <X className="w-3 h-3" />
          </span>
        ) : (
          <ChevronDown className="w-3 h-3 text-muted-foreground" />
        )}
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 bg-surface-container-lowest border border-border/60 rounded-lg shadow-lg z-50 min-w-[180px] max-h-[240px] overflow-y-auto py-1">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={cn(
                "w-full text-left px-3 py-1.5 text-xs hover:bg-muted/50 transition-colors",
                opt === value && "bg-primary/10 text-primary font-medium",
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function GlobalFilterBar() {
  const { filters, setFilter, clearFilter, clearAll, activeCount } =
    useGlobalFilters();
  const { data: filterOptions } = useGetFilterOptions();

  return (
    <div className="flex items-center gap-2 px-8 py-2.5 bg-surface-container-lowest border-b border-border/40 shrink-0 relative z-20">
      <FilterDropdown
        label="Date Range"
        icon={Calendar}
        value={
          DATE_RANGE_OPTIONS.find((o) => o.value === filters.dateRange)
            ?.label || "Last 7 days"
        }
        options={DATE_RANGE_OPTIONS.map((o) => o.label)}
        onChange={(label) => {
          const opt = DATE_RANGE_OPTIONS.find((o) => o.label === label);
          if (opt) setFilter("dateRange", opt.value);
        }}
      />

      <FilterDropdown
        label="Region"
        icon={Globe}
        value={filters.region}
        options={filterOptions?.regions || ["us-en", "gb-en", "de-de", "fr-fr"]}
        onChange={(v) => setFilter("region", v)}
        onClear={() => clearFilter("region")}
      />

      <FilterDropdown
        label="Platform"
        value={filters.platform}
        options={filterOptions?.platforms || []}
        onChange={(v) => setFilter("platform", v)}
        onClear={() => clearFilter("platform")}
      />

      <FilterDropdown
        label="Topic"
        value={filters.topic}
        options={filterOptions?.topics || []}
        onChange={(v) => setFilter("topic", v)}
        onClear={() => clearFilter("topic")}
      />

      <FilterDropdown
        label="Competitor"
        value={filters.competitor}
        options={filterOptions?.competitors || []}
        onChange={(v) => setFilter("competitor", v)}
        onClear={() => clearFilter("competitor")}
      />

      {activeCount > 0 && (
        <button
          onClick={clearAll}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap ml-1"
        >
          Clear filters
        </button>
      )}

      <div className="ml-auto flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/50 rounded-lg">
          <span className="font-mono text-xs font-bold">—</span>
          <span className="text-[10px] text-muted-foreground">answers</span>
        </div>
      </div>
    </div>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const searchString = useSearch();
  const { data: workspace } = useWorkspaceConfig();

  // Preserve workspaceId across nav links
  const wsId = new URLSearchParams(searchString).get("workspaceId");
  const workspaceQuery = wsId ? `workspaceId=${wsId}` : "";

  const isSetup = location === "/setup";

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col h-full w-60 bg-surface-container-low border-r border-border/30 shrink-0 py-5 px-3">
        <a href="/" className="flex items-center gap-2.5 px-3 mb-6">
          <img
            src="/images/bvisible-logo.svg"
            alt="bVisible"
            className="h-8 w-8 shrink-0"
          />
          <img src="/images/bvisible-text.svg" alt="bVisible" className="h-4" />
          {!isSetup && (
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-ring ml-auto" />
          )}
        </a>

        <div className="flex-1 overflow-y-auto">
          <NavSection
            label="Analytics"
            items={ANALYTICS_NAV}
            location={location}
            workspaceQuery={workspaceQuery}
          />
          <NavSection
            label="Data"
            items={DATA_NAV}
            location={location}
            workspaceQuery={workspaceQuery}
          />
          <NavSection
            label="Actions"
            items={ACTIONS_NAV}
            location={location}
            workspaceQuery={workspaceQuery}
          />
        </div>

        <div className="mt-auto flex flex-col gap-0.5 border-t border-border/40 pt-4">
          <Link
            href={workspaceQuery ? `/settings?${workspaceQuery}` : "/settings"}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-border/20 transition-colors"
          >
            <Settings className="w-4 h-4" /> Settings
          </Link>
          <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-border/20 transition-colors text-left">
            <HelpCircle className="w-4 h-4" /> Support
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 bg-surface">
        {/* Topbar */}
        <header className="flex items-center justify-between px-8 py-4 bg-surface-container-lowest border-b border-border/40 shrink-0">
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {workspace ? workspace.brandName : "Workspace Setup"}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 text-muted-foreground">
              <button className="hover:text-foreground transition-colors">
                <Search className="w-4 h-4" />
              </button>
              <button className="hover:text-foreground transition-colors">
                <Bell className="w-4 h-4" />
              </button>
            </div>
            <Link
              href="/settings"
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium border border-border/60 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              Insights Settings
            </Link>
          </div>
        </header>

        {/* Global Filter Bar */}
        {!isSetup && <GlobalFilterBar />}

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto relative">{children}</div>
      </main>
    </div>
  );
}
