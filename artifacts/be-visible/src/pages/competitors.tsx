import { EmptyState } from "@/components/EmptyState";
import { ArrowLeftRight } from "lucide-react";

export default function CompetitorsPage() {
  return (
    <div className="p-8 h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tighter text-foreground mb-2">Competitor Benchmarking</h1>
        <p className="text-muted-foreground">Head-to-head performance analysis across different language models.</p>
      </div>
      <EmptyState 
        icon={ArrowLeftRight}
        title="Benchmarking pending"
        description="We need audit data to compare your performance against the competitors you identified in your workspace setup."
        actionLabel="Go to Dashboard"
        onAction={() => window.location.href = '/dashboard'}
      />
    </div>
  );
}
