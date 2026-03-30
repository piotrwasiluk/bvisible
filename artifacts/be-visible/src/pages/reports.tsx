import { useState } from "react";
import {
  Plus,
  FileText,
  Calendar,
  Mail,
  Download,
  Clock,
  MoreHorizontal,
  Loader2,
} from "lucide-react";
import {
  useGetReports,
  useCreateReport,
  getGetReportsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

const SECTION_OPTIONS = [
  "Overview KPIs",
  "Visibility Metrics",
  "Citations Analytics",
  "Community",
  "Sentiment Analysis",
  "Prompts Performance",
  "Pages Performance",
];

const DEFAULT_SECTIONS = [
  "Overview KPIs",
  "Visibility Metrics",
  "Citations Analytics",
  "Sentiment Analysis",
  "Pages Performance",
];

export default function ReportsPage() {
  const [showBuilder, setShowBuilder] = useState(false);
  const queryClient = useQueryClient();

  // API data
  const { data, isLoading } = useGetReports();
  const createReport = useCreateReport();

  // Controlled form state
  const [reportName, setReportName] = useState("");
  const [dateRange, setDateRange] = useState("Last 7 days");
  const [schedule, setSchedule] = useState("One-time");
  const [format, setFormat] = useState("PDF");
  const [selectedSections, setSelectedSections] =
    useState<string[]>(DEFAULT_SECTIONS);
  const [recipients, setRecipients] = useState("");

  function toggleSection(label: string) {
    setSelectedSections((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label],
    );
  }

  function resetForm() {
    setReportName("");
    setDateRange("Last 7 days");
    setSchedule("One-time");
    setFormat("PDF");
    setSelectedSections(DEFAULT_SECTIONS);
    setRecipients("");
  }

  function handleGenerate() {
    if (!reportName.trim()) return;
    createReport.mutate(
      {
        data: {
          name: reportName.trim(),
          dateRange,
          schedule,
          format,
          sections: selectedSections,
          recipients: recipients.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getGetReportsQueryKey(),
          });
          resetForm();
          setShowBuilder(false);
        },
      },
    );
  }

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Reports</h1>
          <p className="text-sm text-muted-foreground">
            Create, schedule, and share analytics reports with stakeholders.
          </p>
        </div>
        <button
          onClick={() => setShowBuilder(!showBuilder)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          New Report
        </button>
      </div>

      {/* Report Builder */}
      {showBuilder && (
        <div className="bg-surface-container-lowest rounded-xl ring-1 ring-black/[0.03] p-6 space-y-6">
          <h3 className="text-sm font-bold">Report Builder</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-1.5">
                  Report Name
                </label>
                <input
                  type="text"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  placeholder="e.g., Weekly Executive Summary"
                  className="w-full px-3 py-2 text-sm border border-border/60 rounded-lg bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-1.5">
                  Date Range
                </label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-border/60 rounded-lg bg-transparent"
                >
                  <option>Last 7 days</option>
                  <option>Last 14 days</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                  <option>Custom range</option>
                </select>
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-1.5">
                  Schedule
                </label>
                <select
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-border/60 rounded-lg bg-transparent"
                >
                  <option>One-time</option>
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-1.5">
                  Format
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-border/60 rounded-lg bg-transparent"
                >
                  <option>PDF</option>
                  <option>CSV</option>
                  <option>PDF + CSV</option>
                </select>
              </div>
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-1.5">
                Sections to Include
              </label>
              <div className="space-y-2">
                {SECTION_OPTIONS.map((label) => (
                  <label
                    key={label}
                    className="flex items-center gap-2 text-sm cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedSections.includes(label)}
                      onChange={() => toggleSection(label)}
                      className="rounded border-border"
                    />
                    {label}
                  </label>
                ))}
              </div>
              <div className="mt-4">
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-1.5">
                  Recipients
                </label>
                <input
                  type="text"
                  value={recipients}
                  onChange={(e) => setRecipients(e.target.value)}
                  placeholder="email@company.com"
                  className="w-full px-3 py-2 text-sm border border-border/60 rounded-lg bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleGenerate}
              disabled={createReport.isPending || !reportName.trim()}
              className="px-4 py-2 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              {createReport.isPending && (
                <Loader2 className="w-3 h-3 animate-spin" />
              )}
              Generate Report
            </button>
            <button
              onClick={() => {
                setShowBuilder(false);
                resetForm();
              }}
              className="px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Saved Reports */}
      <div className="bg-surface-container-lowest rounded-xl ring-1 ring-black/[0.03] overflow-hidden">
        <div className="p-6 border-b border-border/20">
          <h3 className="text-sm font-bold">Saved Reports</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Previously created report configurations.
          </p>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border/30 bg-surface-container-low/50">
              <th className="py-3 px-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-normal">
                Report Name
              </th>
              <th className="py-3 px-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-normal">
                Last Generated
              </th>
              <th className="py-3 px-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-normal">
                Schedule
              </th>
              <th className="py-3 px-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-normal">
                Recipients
              </th>
              <th className="py-3 px-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-normal">
                Format
              </th>
              <th className="py-3 px-4 w-20" />
            </tr>
          </thead>
          <tbody>
            {data.items.map((r) => (
              <tr
                key={r.id}
                className="border-b border-border/10 hover:bg-surface-container-low/30 transition-colors"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{r.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" />{" "}
                  {r.lastGeneratedAt
                    ? new Date(r.lastGeneratedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Never"}
                </td>
                <td className="py-3 px-4">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {r.schedule}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Mail className="w-3 h-3" /> {r.recipients ?? "---"}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-[10px] font-medium bg-muted/50 px-2 py-0.5 rounded">
                    {r.format}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    <button className="p-1 text-muted-foreground hover:text-foreground">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1 text-muted-foreground hover:text-foreground">
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {data.items.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="py-8 text-center text-sm text-muted-foreground"
                >
                  No reports yet. Create one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
