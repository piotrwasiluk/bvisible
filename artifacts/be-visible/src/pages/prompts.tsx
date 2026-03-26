import { EmptyState } from "@/components/EmptyState";
import { TerminalSquare } from "lucide-react";

export default function PromptsPage() {
  return (
    <div className="p-8 h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tighter text-foreground mb-2">Prompts Collection</h1>
        <p className="text-muted-foreground">Manage and monitor the search queries driving AI responses.</p>
      </div>
      <EmptyState 
        icon={TerminalSquare}
        title="No prompts analyzed yet"
        description="Run your first audit to auto-discover the most critical prompts related to your product categories and brand."
        actionLabel="Go to Dashboard"
        onAction={() => window.location.href = '/dashboard'}
      />
    </div>
  );
}
