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

export const mentionsTable = pgTable("mentions", {
  id: serial("id").primaryKey(),
  workspaceId: integer("workspace_id")
    .notNull()
    .references(() => workspacesTable.id, { onDelete: "cascade" }),
  executionId: integer("execution_id")
    .notNull()
    .references(() => promptExecutionsTable.id, { onDelete: "cascade" }),
  brandName: text("brand_name").notNull(),
  isOwnBrand: boolean("is_own_brand").notNull().default(false),
  position: integer("position"),
  sentimentScore: integer("sentiment_score"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertMentionSchema = createInsertSchema(mentionsTable).omit({
  id: true,
  createdAt: true,
});

export type InsertMention = z.infer<typeof insertMentionSchema>;
export type Mention = typeof mentionsTable.$inferSelect;
