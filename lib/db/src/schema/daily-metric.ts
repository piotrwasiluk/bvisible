import {
  pgTable,
  serial,
  text,
  integer,
  real,
  date,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { workspacesTable } from "./workspace";

export const dailyMetricsTable = pgTable("daily_metrics", {
  id: serial("id").primaryKey(),
  workspaceId: integer("workspace_id")
    .notNull()
    .references(() => workspacesTable.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  platform: text("platform"),
  topic: text("topic"),
  competitor: text("competitor"),
  mentionRate: real("mention_rate").notNull().default(0),
  shareOfVoice: real("share_of_voice").notNull().default(0),
  citationRate: real("citation_rate").notNull().default(0),
  citationShare: real("citation_share").notNull().default(0),
  avgPosition: real("avg_position").notNull().default(0),
  sentimentScore: integer("sentiment_score").notNull().default(0),
  totalMentions: integer("total_mentions").notNull().default(0),
  totalCitations: integer("total_citations").notNull().default(0),
  totalExecutions: integer("total_executions").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertDailyMetricSchema = createInsertSchema(
  dailyMetricsTable,
).omit({
  id: true,
  createdAt: true,
});

export type InsertDailyMetric = z.infer<typeof insertDailyMetricSchema>;
export type DailyMetric = typeof dailyMetricsTable.$inferSelect;
