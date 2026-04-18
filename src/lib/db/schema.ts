import { pgTable, uuid, text, varchar, timestamp } from "drizzle-orm/pg-core";

export const links = pgTable("links", {
  id: uuid("id").primaryKey().defaultRandom(),
  url: text("url").notNull(),
  alias: varchar("alias", { length: 16 }).unique().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Link = typeof links.$inferSelect;
export type NewLink = typeof links.$inferInsert;
