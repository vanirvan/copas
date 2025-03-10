import { pgTable, serial, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  user_id: varchar("user_id", { length: 255}).notNull().unique(),
  email: varchar("email", { length: 255}).notNull().unique(),
  name: varchar("name", { length: 255}).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull()
});

export const shortens = pgTable("shortens", {
  id: serial("id").primaryKey(),
  alias: varchar("alias", { length: 255}).notNull(),
  url: varchar("url", { length: 2083}).notNull(),
  user_id: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull()
});

export const views = pgTable("views", {
  id: serial("id").primaryKey(),
  ip: varchar("ip", { length: 45 }).notNull(),
  shorten_id: integer("shorten_id").notNull().references(() => shortens.id, { onDelete: "cascade" }),
  created_at: timestamp("created_at").defaultNow().notNull()
});

export const shortensRelations = relations(shortens, ({ one }) => ({
  user: one(users, {
    fields: [shortens.user_id],
    references: [users.id],
  })
}));

export const viewsRelations = relations(views, ({ one }) => ({
  shorten: one(shortens, {
    fields: [views.shorten_id],
    references: [shortens.id],
  })
}));
