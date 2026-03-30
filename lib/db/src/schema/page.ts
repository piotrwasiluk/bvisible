import {
  pgTable,
  serial,
  text,
  integer,
  real,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { workspacesTable } from "./workspace";

export const pagesTable = pgTable("pages", {
  id: serial("id").primaryKey(),
  workspaceId: integer("workspace_id")
    .notNull()
    .references(() => workspacesTable.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  folder: text("folder").notNull().default("blog"),
  primaryKeyword: text("primary_keyword"),
  clicks: integer("clicks").notNull().default(0),
  clicksChange: real("clicks_change").notNull().default(0),
  impressions: integer("impressions").notNull().default(0),
  impressionsChange: real("impressions_change").notNull().default(0),
  position: real("position").notNull().default(0),
  positionChange: real("position_change").notNull().default(0),
  ctr: real("ctr").notNull().default(0),
  ctrChange: real("ctr_change").notNull().default(0),
  citationCount: integer("citation_count").notNull().default(0),
  citationCountChange: real("citation_count_change").notNull().default(0),
  citationRate: real("citation_rate").notNull().default(0),
  citationRateChange: real("citation_rate_change").notNull().default(0),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertPageSchema = createInsertSchema(pagesTable).omit({
  id: true,
  updatedAt: true,
});

export type InsertPage = z.infer<typeof insertPageSchema>;
export type Page = typeof pagesTable.$inferSelect;
