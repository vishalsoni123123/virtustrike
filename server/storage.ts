import { MySQLStorage } from "./mysql-storage";
import { MongoDBStorage } from "./mongo-storage";
import { users, games, bookings, type User, type InsertUser, type Game, type InsertGame, type Booking, type InsertBooking, INITIAL_GAMES } from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUserProfile(id: number): Promise<User | undefined>;

  // Games
  getGames(): Promise<Game[]>;
  getGame(id: number): Promise<Game | undefined>;
  createGame(game: InsertGame): Promise<Game>; // Added createGame method

  // Bookings
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBookingsByDate(date: Date): Promise<Booking[]>;
  getUserBookings(userId: number): Promise<Booking[]>;
  updateBookingPayment(id: number, isPaid: boolean): Promise<void>;
  updateBookingStatus(id: number, status: string): Promise<void>;
}

// Select which storage to use
const USE_MONGODB = process.env.USE_MONGODB === "true";

// Create storage instance
const mongoStorage = new MongoDBStorage();
const mysqlStorage = new MySQLStorage();

// Export the selected storage
export const storage = USE_MONGODB ? mongoStorage : mysqlStorage;

// Initialize database with sample data
export async function initializeDatabase() {
  try {
    // Check if we already have games
    const existingGames = await storage.getGames();

    if (!existingGames || existingGames.length === 0) {
      console.log("Initializing database with sample data...");

      // Add sample games
      for (const game of INITIAL_GAMES) {
        await storage.createGame(game);
      }

      console.log("Sample data loaded successfully");
    }
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}