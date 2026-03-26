import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { workspacesTable } from "@workspace/db";
import { CreateWorkspaceBody } from "@workspace/api-zod";
import { eq } from "drizzle-orm";
import { z } from "zod";

const StrictWorkspaceBody = CreateWorkspaceBody.extend({
  brandName: z.string().min(1, "Brand name is required"),
  websiteUrl: z.string().min(1, "Website URL is required").url("Must be a valid URL"),
});

const router: IRouter = Router();

router.post("/workspace", async (req, res) => {
  const parsed = StrictWorkspaceBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "validation_error", message: parsed.error.message });
    return;
  }

  const data = parsed.data;

  const existing = await db.select().from(workspacesTable).limit(1);
  let workspace;

  if (existing.length > 0) {
    const [updated] = await db
      .update(workspacesTable)
      .set({
        brandName: data.brandName,
        websiteUrl: data.websiteUrl,
        competitor1Url: data.competitor1Url ?? null,
        competitor2Url: data.competitor2Url ?? null,
        competitor3Url: data.competitor3Url ?? null,
        region: data.region ?? "us-en",
        productCategories: data.productCategories ?? null,
        updatedAt: new Date(),
      })
      .where(eq(workspacesTable.id, existing[0].id))
      .returning();
    workspace = updated;
  } else {
    const [created] = await db
      .insert(workspacesTable)
      .values({
        brandName: data.brandName,
        websiteUrl: data.websiteUrl,
        competitor1Url: data.competitor1Url ?? null,
        competitor2Url: data.competitor2Url ?? null,
        competitor3Url: data.competitor3Url ?? null,
        region: data.region ?? "us-en",
        productCategories: data.productCategories ?? null,
      })
      .returning();
    workspace = created;
  }

  res.status(201).json(workspace);
});

router.get("/workspace", async (_req, res) => {
  const workspaces = await db.select().from(workspacesTable).limit(1);
  if (workspaces.length === 0) {
    res.status(404).json({ error: "not_found", message: "No workspace configured" });
    return;
  }
  res.json(workspaces[0]);
});

export default router;
