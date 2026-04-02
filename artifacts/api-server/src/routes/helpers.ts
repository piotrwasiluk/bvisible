import type { Request } from "express";
import { db } from "@workspace/db";
import { workspacesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

/**
 * Extract workspaceId from query params. Falls back to the first paid workspace.
 */
export async function resolveWorkspaceId(req: Request): Promise<number | null> {
  const id = Number(req.query.workspaceId);
  if (id > 0) return id;

  // Fallback: first paid workspace
  const rows = await db
    .select({ id: workspacesTable.id })
    .from(workspacesTable)
    .where(eq(workspacesTable.type, "paid"))
    .limit(1);
  return rows.length > 0 ? rows[0].id : null;
}

/**
 * Get workspace brand name by ID.
 */
export async function getWorkspaceBrandName(
  workspaceId: number,
): Promise<string> {
  const rows = await db
    .select({ brandName: workspacesTable.brandName })
    .from(workspacesTable)
    .where(eq(workspacesTable.id, workspaceId))
    .limit(1);
  return rows.length > 0 ? rows[0].brandName : "Brand";
}
