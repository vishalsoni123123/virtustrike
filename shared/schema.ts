import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  phoneNumber: text("phone_number").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  maxPlayers: integer("max_players").notNull(),
  minPlayers: integer("min_players").notNull(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  gameId: integer("game_id").notNull(),
  date: timestamp("date").notNull(),
  teamSize: integer("team_size").notNull(),
  totalAmount: integer("total_amount").notNull(),
  isPaid: boolean("is_paid").default(false),
  location: text("location").notNull(),
  status: text("status").notNull().default('pending'),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertGameSchema = createInsertSchema(games);
export const insertBookingSchema = createInsertSchema(bookings);
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  phoneNumber: true,
});

export type Game = typeof games.$inferSelect;
export type InsertGame = z.infer<typeof insertGameSchema>;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export const INITIAL_GAMES: InsertGame[] = [
  {
    name: "Zombie Apocalypse",
    description: "Survive waves of undead in this intense VR shooter",
    imageUrl: "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d",
    maxPlayers: 8,
    minPlayers: 2,
  },
  {
    name: "Space Explorer",
    description: "Navigate through zero gravity and explore distant planets",
    imageUrl: "https://images.unsplash.com/photo-1459550428001-4ed6ca421293",
    maxPlayers: 6,
    minPlayers: 2,
  },
  {
    name: "Medieval Quest",
    description: "Epic fantasy adventure with swords and sorcery",
    imageUrl: "https://images.unsplash.com/photo-1588590560438-5e27fe3f6b71",
    maxPlayers: 8,
    minPlayers: 2,
  },
  {
    name: "Future Racing",
    description: "High-speed racing through neon-lit cityscapes",
    imageUrl: "https://images.unsplash.com/photo-1603459404909-2ce99c16ab54",
    maxPlayers: 6,
    minPlayers: 2,
  },
  {
    name: "Cyber Arena",
    description: "Team-based combat in a digital battleground",
    imageUrl: "https://images.unsplash.com/photo-1493497029755-f49c8e9a8bbe",
    maxPlayers: 8,
    minPlayers: 4,
  },
  {
    name: "Island Escape",
    description: "Solve puzzles and escape a mysterious tropical island",
    imageUrl: "https://images.unsplash.com/photo-1585591841924-285043b0c468",
    maxPlayers: 6,
    minPlayers: 2,
  },
];