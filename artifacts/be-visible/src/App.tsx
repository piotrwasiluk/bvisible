import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useWorkspaceConfig } from "@/hooks/use-workspace";
import { AppLayout } from "@/components/AppLayout";

import LandingPage from "@/pages/landing";
import SetupPage from "@/pages/setup";
import DashboardPage from "@/pages/dashboard";
import PromptsPage from "@/pages/prompts";
import CitationsPage from "@/pages/citations";
import TopicGapsPage from "@/pages/topic-gaps";
import CompetitorsPage from "@/pages/competitors";
import RecommendationsPage from "@/pages/recommendations";
import ReportsPage from "@/pages/reports";
import SettingsPage from "@/pages/settings";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function AppRedirect() {
  const { data: workspace, isLoading, error } = useWorkspaceConfig();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <div className="w-8 h-8 rounded-full bg-emerald-500 animate-pulse" />
      </div>
    );
  }

  if (error || !workspace) {
    return <Redirect to="/setup" />;
  }

  return <Redirect to="/dashboard" />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />

      <Route path="/app" component={AppRedirect} />

      <Route path="/setup">
        <AppLayout><SetupPage /></AppLayout>
      </Route>

      <Route path="/dashboard">
        <AppLayout><DashboardPage /></AppLayout>
      </Route>

      <Route path="/prompts">
        <AppLayout><PromptsPage /></AppLayout>
      </Route>

      <Route path="/citations">
        <AppLayout><CitationsPage /></AppLayout>
      </Route>

      <Route path="/topic-gaps">
        <AppLayout><TopicGapsPage /></AppLayout>
      </Route>

      <Route path="/competitors">
        <AppLayout><CompetitorsPage /></AppLayout>
      </Route>

      <Route path="/recommendations">
        <AppLayout><RecommendationsPage /></AppLayout>
      </Route>

      <Route path="/reports">
        <AppLayout><ReportsPage /></AppLayout>
      </Route>

      <Route path="/settings">
        <AppLayout><SettingsPage /></AppLayout>
      </Route>

      <Route>
        <AppLayout><NotFound /></AppLayout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
