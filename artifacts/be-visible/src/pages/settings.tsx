import { EmptyState } from "@/components/EmptyState";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-8 h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tighter text-foreground mb-2">
          Workspace Settings
        </h1>
        <p className="text-muted-foreground">
          Manage domains, users, and audit configurations.
        </p>
      </div>
      <EmptyState
        icon={Settings}
        title="Settings Module"
        description="Configuration for APIs, integrations, and workspace defaults."
      />
    </div>
  );
}
