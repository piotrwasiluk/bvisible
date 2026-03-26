import { EmptyState } from "@/components/EmptyState";
import { Quote } from "lucide-react";

export default function CitationsPage() {
  return (
    <div className="p-8 h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tighter text-foreground mb-2">Citation Intelligence</h1>
        <p className="text-muted-foreground">Identify which specific pages models use to construct answers.</p>
      </div>
      <EmptyState 
        icon={Quote}
        title="No citations recorded"
        description="Audit results will map your most referenced pages to specific LLMs and topics, highlighting strong and weak assets."
        actionLabel="Go to Dashboard"
        onAction={() => window.location.href = '/dashboard'}
      />
    </div>
  );
}
