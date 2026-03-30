import {
  pgTable,
  serial,
  text,
  integer,
  real,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { workspacesTable } from "./workspace";

export const sentimentThemesTable = pgTable("sentiment_themes", {
  id: serial("id").primaryKey(),
  workspaceId: integer("workspace_id")
    .notNull()
    .references(() => workspacesTable.id, { onDelete: "cascade" }),
  theme: text("theme").notNull(),
  sentimentScore: integer("sentiment_score").notNull(),
  volumePct: real("volume_pct").notNull().default(0),
  occurrences: integer("occurrences").notNull().default(0),
  isPositive: boolean("is_positive").notNull().default(true),
  exampleText: text("example_text"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertSentimentThemeSchema = createInsertSchema(
  sentimentThemesTable,
).omit({
  id: true,
  createdAt: true,
});

export type InsertSentimentTheme = z.infer<typeof insertSentimentThemeSchema>;
export type SentimentTheme = typeof sentimentThemesTable.$inferSelect;
