import { EmptyState } from "@/components/EmptyState";
import { FileText } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="p-8 h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tighter text-foreground mb-2">Reports & Exports</h1>
        <p className="text-muted-foreground">Generate executive summaries and historical tracking data.</p>
      </div>
      <EmptyState 
        icon={FileText}
        title="No reports generated"
        description="Saved views, CSV exports, and executive scorecards will appear here."
      />
    </div>
  );
}
