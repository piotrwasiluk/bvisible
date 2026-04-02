import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { reportsTable, workspacesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { resolveWorkspaceId } from "./helpers.js";

const router: IRouter = Router();

const ReportBody = z.object({
  name: z.string().min(1, "Name is required"),
  dateRange: z.string().optional().default("7d"),
  schedule: z.string().optional().default("one-time"),
  format: z.string().optional().default("pdf"),
  sections: z.array(z.string()).optional(),
  recipients: z.string().optional(),
});

router.get("/reports", async (req, res) => {
  const wsId = await resolveWorkspaceId(req);
  const rows = wsId
    ? await db
        .select()
        .from(reportsTable)
        .where(eq(reportsTable.workspaceId, wsId))
    : await db.select().from(reportsTable);
  const items = rows.map((r) => ({
    id: r.id,
    name: r.name,
    dateRange: r.dateRange,
    schedule: r.schedule,
    format: r.format,
    sections: r.sections,
    recipients: r.recipients,
    lastGeneratedAt: r.lastGeneratedAt?.toISOString() ?? null,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }));
  res.json({ items });
});

router.post("/reports", async (req, res) => {
  const parsed = ReportBody.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ error: "validation_error", message: parsed.error.message });
    return;
  }

  // Get workspace id
  const wsId = await resolveWorkspaceId(req);
  if (!wsId) {
    res
      .status(400)
      .json({ error: "no_workspace", message: "No workspace configured" });
    return;
  }

  const [report] = await db
    .insert(reportsTable)
    .values({
      workspaceId: wsId,
      name: parsed.data.name,
      dateRange: parsed.data.dateRange,
      schedule: parsed.data.schedule,
      format: parsed.data.format,
      sections: parsed.data.sections ?? null,
      recipients: parsed.data.recipients ?? null,
    })
    .returning();

  res.status(201).json({
    id: report.id,
    name: report.name,
    dateRange: report.dateRange,
    schedule: report.schedule,
    format: report.format,
    sections: report.sections,
    recipients: report.recipients,
    lastGeneratedAt: report.lastGeneratedAt?.toISOString() ?? null,
    createdAt: report.createdAt.toISOString(),
    updatedAt: report.updatedAt.toISOString(),
  });
});

export default router;
