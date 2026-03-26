import { EmptyState } from "@/components/EmptyState";
import { ListTodo } from "lucide-react";

export default function RecommendationsPage() {
  return (
    <div className="p-8 h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tighter text-foreground mb-2">Actionable Recommendations</h1>
        <p className="text-muted-foreground">Your prioritized content and technical backlog.</p>
      </div>
      <EmptyState 
        icon={ListTodo}
        title="Your backlog is clear"
        description="We synthesize gaps and citation weaknesses into concrete steps. Run an audit to generate your first set of recommendations."
        actionLabel="Go to Dashboard"
        onAction={() => window.location.href = '/dashboard'}
      />
    </div>
  );
}
