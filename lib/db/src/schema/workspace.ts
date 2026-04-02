import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const workspacesTable = pgTable("workspaces", {
  id: serial("id").primaryKey(),
  type: text("type").notNull().default("paid"),
  brandName: text("brand_name").notNull(),
  websiteUrl: text("website_url").notNull(),
  competitor1Url: text("competitor1_url"),
  competitor2Url: text("competitor2_url"),
  competitor3Url: text("competitor3_url"),
  region: text("region").notNull().default("us-en"),
  productCategories: text("product_categories"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertWorkspaceSchema = createInsertSchema(workspacesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertWorkspace = z.infer<typeof insertWorkspaceSchema>;
export type Workspace = typeof workspacesTable.$inferSelect;
