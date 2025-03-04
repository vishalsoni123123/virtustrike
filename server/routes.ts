import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertBookingSchema } from "@shared/schema";
import { z } from "zod";
import sgMail from '@sendgrid/mail';

// Email setup (will be configured later)
const sendBookingConfirmationEmail = async (booking: any, userEmail: string) => {
  try {
    // For now, just log the email that would be sent
    console.log('Would send email to:', userEmail, 'for booking:', booking);
    console.log('Email content:', `
      Booking Confirmation
      Date: ${new Date(booking.date).toLocaleString()}
      Location: ${booking.location}
      Team Size: ${booking.teamSize}
      Amount: ₹${booking.totalAmount}
    `);
    return true;
  } catch (error) {
    console.error('Email error:', error);
    return false;
  }
};

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

  app.get("/api/user/profile", async (req, res) => {
    // Extract username from headers if available
    const username = req.headers['x-username'] as string;
    
    let user;
    if (username) {
      user = await storage.getUserByUsername(username);
    } else {
      // Fallback to userId 1 for testing purposes
      user = await storage.getUserProfile(1);
    }
    
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(user);
  });

  app.get("/api/user/bookings", async (req, res) => {
    // This would normally check the session
    const userId = 1; // Temporary, should come from session
    const bookings = await storage.getUserBookings(userId);
    res.json(bookings);
  });

  app.post("/api/bookings", async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(bookingData);

      // Send email if booking is paid
      if (booking.isPaid) {
        const user = await storage.getUser(booking.userId);
        if (user) {
          await sendBookingConfirmationEmail(booking, user.email);
        }
      }

      res.json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid booking data" });
        return;
      }
      throw error;
    }
  });

  app.post("/api/bookings/:id/pay", async (req, res) => {
    const bookingId = Number(req.params.id);
    await storage.updateBookingPayment(bookingId, true);

    // Send confirmation email
    const booking = (await storage.getUserBookings(1)).find(b => b.id === bookingId);
    if (booking) {
      const user = await storage.getUser(booking.userId);
      if (user) {
        await sendBookingConfirmationEmail(booking, user.email);
      }
    }

    res.json({ message: "Payment completed" });
  });

  app.get("/api/bookings/date/:date", async (req, res) => {
    const date = new Date(req.params.date);
    const bookings = await storage.getBookingsByDate(date);
    res.json(bookings);
  });

  const httpServer = createServer(app);
  return httpServer;
}