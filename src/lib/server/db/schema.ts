import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const saved_anime = sqliteTable("saved_anime", {
    id: integer("id").primaryKey(),
    title: text("title").notNull(),
    image_url: text("image_url").notNull(),
    score: integer("score").notNull(),
    episodes: integer("episodes").notNull(),
    format: text("format").notNull(),
    synopsis: text("synopsis").notNull(),
    genres: text("genres").notNull(),
    status: text("status").notNull(),
    rating: integer("rating").notNull(),
    saved_at: integer("saved_at", { mode: "timestamp" }).notNull(),
});
