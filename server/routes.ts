import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertBookingSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/games", async (_req, res) => {
    const games = await storage.getGames();
    res.json(games);
  });

  app.get("/api/games/:id", async (req, res) => {
    const game = await storage.getGame(Number(req.params.id));
    if (!game) {
      res.status(404).json({ message: "Game not found" });
      return;
    }
    res.json(game);
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        res.status(400).json({ message: "Username already taken" });
        return;
      }
      const user = await storage.createUser(userData);
      res.json({ id: user.id, username: user.username });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid user data" });
        return;
      }
      throw error;
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await storage.getUserByUsername(username);
    if (!user || user.password !== password) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }
    res.json({ id: user.id, username: user.username });
  });

  app.post("/api/bookings", async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(bookingData);
      res.json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid booking data" });
        return;
      }
      throw error;
    }
  });

  app.get("/api/bookings/date/:date", async (req, res) => {
    const date = new Date(req.params.date);
    const bookings = await storage.getBookingsByDate(date);
    res.json(bookings);
  });

  const httpServer = createServer(app);
  return httpServer;
}
