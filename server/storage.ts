import { users, games, bookings, type User, type InsertUser, type Game, type InsertGame, type Booking, type InsertBooking, INITIAL_GAMES } from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Games
  getGames(): Promise<Game[]>;
  getGame(id: number): Promise<Game | undefined>;
  
  // Bookings
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBookingsByDate(date: Date): Promise<Booking[]>;
  getUserBookings(userId: number): Promise<Booking[]>;
  updateBookingPayment(id: number, isPaid: boolean): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private games: Map<number, Game>;
  private bookings: Map<number, Booking>;
  private currentUserId: number;
  private currentBookingId: number;

  constructor() {
    this.users = new Map();
    this.games = new Map();
    this.bookings = new Map();
    this.currentUserId = 1;
    this.currentBookingId = 1;

    // Initialize games
    INITIAL_GAMES.forEach((game, index) => {
      this.games.set(index + 1, { ...game, id: index + 1 });
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getGames(): Promise<Game[]> {
    return Array.from(this.games.values());
  }

  async getGame(id: number): Promise<Game | undefined> {
    return this.games.get(id);
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = this.currentBookingId++;
    const booking: Booking = { ...insertBooking, id };
    this.bookings.set(id, booking);
    return booking;
  }

  async getBookingsByDate(date: Date): Promise<Booking[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return Array.from(this.bookings.values()).filter(
      (booking) => booking.date >= startOfDay && booking.date <= endOfDay
    );
  }

  async getUserBookings(userId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      (booking) => booking.userId === userId
    );
  }

  async updateBookingPayment(id: number, isPaid: boolean): Promise<void> {
    const booking = this.bookings.get(id);
    if (booking) {
      this.bookings.set(id, { ...booking, isPaid });
    }
  }
}

export const storage = new MemStorage();
