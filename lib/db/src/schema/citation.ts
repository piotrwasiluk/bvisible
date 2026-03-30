import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { workspacesTable } from "./workspace";
import { promptExecutionsTable } from "./prompt-execution";

export const citationsTable = pgTable("citations", {
  id: serial("id").primaryKey(),
  workspaceId: integer("workspace_id")
    .notNull()
    .references(() => workspacesTable.id, { onDelete: "cascade" }),
  executionId: integer("execution_id")
    .notNull()
    .references(() => promptExecutionsTable.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  domain: text("domain").notNull(),
  domainType: text("domain_type").notNull().default("Products"),
  pageType: text("page_type"),
  influenceScore: integer("influence_score").notNull().default(50),
  domainAuthority: integer("domain_authority"),
  hasBrandReference: boolean("has_brand_reference").notNull().default(false),
  competitorReferences: text("competitor_references").array(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCitationSchema = createInsertSchema(citationsTable).omit({
  id: true,
  createdAt: true,
});

export type InsertCitation = z.infer<typeof insertCitationSchema>;
export type Citation = typeof citationsTable.$inferSelect;
