import { EmptyState } from "@/components/EmptyState";
import { BarChart } from "lucide-react";

export default function TopicGapsPage() {
  return (
    <div className="p-8 h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tighter text-foreground mb-2">Topic Gap Analysis</h1>
        <p className="text-muted-foreground">Discover where competitors are cited but you are omitted.</p>
      </div>
      <EmptyState 
        icon={BarChart}
        title="Awaiting analysis data"
        description="Once an audit completes, this section will surface content blind spots and calculate the expected upside of filling them."
        actionLabel="Go to Dashboard"
        onAction={() => window.location.href = '/dashboard'}
      />
    </div>
  );
}
