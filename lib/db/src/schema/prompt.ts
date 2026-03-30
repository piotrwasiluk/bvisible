import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { workspacesTable } from "./workspace";
import { topicsTable } from "./topic";

export const promptsTable = pgTable("prompts", {
  id: serial("id").primaryKey(),
  workspaceId: integer("workspace_id")
    .notNull()
    .references(() => workspacesTable.id, { onDelete: "cascade" }),
  topicId: integer("topic_id").references(() => topicsTable.id, {
    onDelete: "set null",
  }),
  text: text("text").notNull(),
  type: text("type").notNull().default("Category Related"),
  tags: text("tags").array(),
  fanoutCount: integer("fanout_count").notNull().default(10),
  searchVolume: integer("search_volume"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPromptSchema = createInsertSchema(promptsTable).omit({
  id: true,
  createdAt: true,
});

export type InsertPrompt = z.infer<typeof insertPromptSchema>;
export type Prompt = typeof promptsTable.$inferSelect;
