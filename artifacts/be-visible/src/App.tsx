import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useWorkspaceConfig } from "@/hooks/use-workspace";
import { AppLayout } from "@/components/AppLayout";

import LandingPage from "@/pages/landing";
import SetupPage from "@/pages/setup";
import OverviewPage from "@/pages/overview";
import VisibilityPage from "@/pages/visibility";
import CitationsAnalyticsPage from "@/pages/citations-analytics";
import CommunityPage from "@/pages/community";
import SentimentPage from "@/pages/sentiment";
import PromptsPage from "@/pages/prompts";
import PagesPage from "@/pages/pages";
import CitationsDetailPage from "@/pages/citations-detail";
import OpportunitiesPage from "@/pages/opportunities";
import ReportsPage from "@/pages/reports";
import SettingsPage from "@/pages/settings";
import LoginPage from "@/pages/login";
import AuditPage from "@/pages/audit";
import ContactPage from "@/pages/contact";
import BlogPage from "@/pages/blog";
import BlogArticlePage from "@/pages/blog-article";
import DocsPage from "@/pages/docs";
import FeatureChatGPTPage from "@/pages/feature-chatgpt";
import FeatureGeminiPage from "@/pages/feature-gemini";
import FeatureClaudePage from "@/pages/feature-claude";
import ComparePeecPage from "@/pages/compare-peec";
import CompareProfoundPage from "@/pages/compare-profound";
import CompareSemrushPage from "@/pages/compare-semrush";
import CompareAhrefsPage from "@/pages/compare-ahrefs";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
});

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

  return <Redirect to="/overview" />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />

      <Route path="/app" component={AppRedirect} />

      {/* Redirect old routes */}
      <Route path="/dashboard">
        <Redirect to="/overview" />
      </Route>

      <Route path="/login" component={LoginPage} />
      <Route path="/audit" component={AuditPage} />
      <Route path="/contact" component={ContactPage} />

      <Route path="/blog" component={BlogPage} />
      <Route path="/blog/:slug" component={BlogArticlePage} />

      <Route path="/docs" component={DocsPage} />
      <Route path="/docs/:section" component={DocsPage} />

      <Route path="/features/chatgpt" component={FeatureChatGPTPage} />
      <Route path="/features/gemini" component={FeatureGeminiPage} />
      <Route path="/features/claude" component={FeatureClaudePage} />

      <Route path="/compare/peec" component={ComparePeecPage} />
      <Route path="/compare/profound" component={CompareProfoundPage} />
      <Route path="/compare/semrush" component={CompareSemrushPage} />
      <Route path="/compare/ahrefs" component={CompareAhrefsPage} />

      <Route path="/setup">
        <AppLayout>
          <SetupPage />
        </AppLayout>
      </Route>

      <Route path="/overview">
        <AppLayout>
          <OverviewPage />
        </AppLayout>
      </Route>

      <Route path="/visibility">
        <AppLayout>
          <VisibilityPage />
        </AppLayout>
      </Route>

      <Route path="/citations-analytics">
        <AppLayout>
          <CitationsAnalyticsPage />
        </AppLayout>
      </Route>

      <Route path="/community">
        <AppLayout>
          <CommunityPage />
        </AppLayout>
      </Route>

      <Route path="/sentiment">
        <AppLayout>
          <SentimentPage />
        </AppLayout>
      </Route>

      <Route path="/prompts">
        <AppLayout>
          <PromptsPage />
        </AppLayout>
      </Route>

      <Route path="/pages">
        <AppLayout>
          <PagesPage />
        </AppLayout>
      </Route>

      <Route path="/citations-detail">
        <AppLayout>
          <CitationsDetailPage />
        </AppLayout>
      </Route>

      <Route path="/opportunities">
        <AppLayout>
          <OpportunitiesPage />
        </AppLayout>
      </Route>

      <Route path="/reports">
        <AppLayout>
          <ReportsPage />
        </AppLayout>
      </Route>

      <Route path="/settings">
        <AppLayout>
          <SettingsPage />
        </AppLayout>
      </Route>

      <Route>
        <AppLayout>
          <NotFound />
        </AppLayout>
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
