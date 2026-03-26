import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  TerminalSquare, 
  Quote, 
  BarChart, 
  Users,
  ListTodo,
  FileText,
  Settings,
  HelpCircle,
  Plus,
  Search,
  Bell,
  Play
} from "lucide-react";
import { useWorkspaceConfig } from "@/hooks/use-workspace";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/prompts", label: "Prompts", icon: TerminalSquare },
  { href: "/citations", label: "Citations", icon: Quote },
  { href: "/topic-gaps", label: "Topic Gaps", icon: BarChart },
  { href: "/competitors", label: "Competitors", icon: Users },
  { href: "/recommendations", label: "Recommendations", icon: ListTodo },
  { href: "/reports", label: "Reports", icon: FileText },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { data: workspace } = useWorkspaceConfig();

  const isSetup = location === "/setup";

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col h-full w-64 bg-surface-container-low border-r border-border/30 shrink-0 py-6 px-4">
        <div className="flex items-center gap-3 px-2 mb-8">
          <img src="/images/bvisible-logo-v2.png" alt="bVisible" className="h-9 w-9 object-contain shrink-0 brightness-0" />
          <span className="font-bold text-foreground tracking-tight text-base leading-none">
            b<span className="text-lg">V</span>isible
          </span>
          {!isSetup && <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-ring" />}
        </div>
        
        <div className="flex flex-col gap-1 mb-6 px-2">
          <button className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
            <Plus className="w-4 h-4" /> New Audit
          </button>
        </div>

        <nav className="flex-1 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = location === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-surface-container-lowest text-foreground shadow-sm ring-1 ring-black/[0.03]" 
                    : "text-muted-foreground hover:text-foreground hover:bg-border/20"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-1 border-t border-border/40 pt-4">
          <Link href="/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-border/20 transition-colors">
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
            {!isSetup && (
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-mono text-xs font-bold uppercase tracking-widest hover:bg-primary/90 transition-all active:scale-[0.98]">
                <Play className="w-3 h-3" />
                Run Audit
              </button>
            )}
            <div className="flex items-center gap-3 text-muted-foreground">
              <button className="hover:text-foreground transition-colors"><Search className="w-4 h-4" /></button>
              <button className="hover:text-foreground transition-colors"><Bell className="w-4 h-4" /></button>
            </div>
            <div className="h-8 w-8 rounded-full bg-surface-container-low border border-border overflow-hidden flex items-center justify-center">
              <span className="text-xs font-bold font-mono text-muted-foreground">US</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto relative">
          {children}
        </div>
      </main>
    </div>
  );
}
