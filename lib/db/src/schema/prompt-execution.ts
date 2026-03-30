import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { workspacesTable } from "./workspace";
import { promptsTable } from "./prompt";

export const promptExecutionsTable = pgTable("prompt_executions", {
  id: serial("id").primaryKey(),
  workspaceId: integer("workspace_id")
    .notNull()
    .references(() => workspacesTable.id, { onDelete: "cascade" }),
  promptId: integer("prompt_id")
    .notNull()
    .references(() => promptsTable.id, { onDelete: "cascade" }),
  platform: text("platform").notNull(),
  persona: text("persona"),
  region: text("region").notNull().default("us-en"),
  rawResponse: text("raw_response"),
  executedAt: timestamp("executed_at").notNull().defaultNow(),
});

export const insertPromptExecutionSchema = createInsertSchema(
  promptExecutionsTable,
).omit({
  id: true,
});

export type InsertPromptExecution = z.infer<typeof insertPromptExecutionSchema>;
export type PromptExecution = typeof promptExecutionsTable.$inferSelect;
