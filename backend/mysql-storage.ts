
import mysql from 'mysql2/promise';
import { type User, type InsertUser, type Game, type InsertGame, type Booking, type InsertBooking } from "@backend/schema";
import { IStorage } from './storage';

export class MySQLStorage implements IStorage {
  private pool: mysql.Pool;

  constructor(config: mysql.PoolOptions) {
    this.pool = mysql.createPool(config);
  }

  async initialize(): Promise<void> {
    // Create tables if they don't exist
    const conn = await this.pool.getConnection();
    try {
      await conn.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL
        )
      `);
      
      await conn.query(`
        CREATE TABLE IF NOT EXISTS games (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          image_url VARCHAR(255) NOT NULL,
          max_players INT NOT NULL,
          min_players INT NOT NULL
        )
      `);
      
      await conn.query(`
        CREATE TABLE IF NOT EXISTS bookings (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          game_id INT NOT NULL,
          date DATETIME NOT NULL,
          team_size INT NOT NULL,
          total_amount INT NOT NULL,
          is_paid BOOLEAN DEFAULT FALSE
        )
      `);
    } finally {
      conn.release();
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    const [rows] = await this.pool.query<mysql.RowDataPacket[]>(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) return undefined;
    
    return {
      id: rows[0].id,
      username: rows[0].username,
      password: rows[0].password,
      email: rows[0].email
    };
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [rows] = await this.pool.query<mysql.RowDataPacket[]>(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    
    if (rows.length === 0) return undefined;
    
    return {
      id: rows[0].id,
      username: rows[0].username,
      password: rows[0].password,
      email: rows[0].email
    };
  }

  async createUser(user: InsertUser): Promise<User> {
    const [result] = await this.pool.query<mysql.ResultSetHeader>(
      'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
      [user.username, user.password, user.email]
    );
    
    return {
      id: result.insertId,
      ...user
    };
  }

  async getGames(): Promise<Game[]> {
    const [rows] = await this.pool.query<mysql.RowDataPacket[]>('SELECT * FROM games');
    
    return rows.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      imageUrl: row.image_url,
      maxPlayers: row.max_players,
      minPlayers: row.min_players
    }));
  }

  async getGame(id: number): Promise<Game | undefined> {
    const [rows] = await this.pool.query<mysql.RowDataPacket[]>(
      'SELECT * FROM games WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) return undefined;
    
    return {
      id: rows[0].id,
      name: rows[0].name,
      description: rows[0].description,
      imageUrl: rows[0].image_url,
      maxPlayers: rows[0].max_players,
      minPlayers: rows[0].min_players
    };
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [result] = await this.pool.query<mysql.ResultSetHeader>(
      'INSERT INTO bookings (user_id, game_id, date, team_size, total_amount, is_paid) VALUES (?, ?, ?, ?, ?, ?)',
      [booking.userId, booking.gameId, booking.date, booking.teamSize, booking.totalAmount, booking.isPaid]
    );
    
    return {
      id: result.insertId,
      ...booking
    };
  }

  async getBookingsByDate(date: Date): Promise<Booking[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    const [rows] = await this.pool.query<mysql.RowDataPacket[]>(
      'SELECT * FROM bookings WHERE date BETWEEN ? AND ?',
      [startOfDay, endOfDay]
    );
    
    return rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      gameId: row.game_id,
      date: new Date(row.date),
      teamSize: row.team_size,
      totalAmount: row.total_amount,
      isPaid: !!row.is_paid
    }));
  }

  async getUserBookings(userId: number): Promise<Booking[]> {
    const [rows] = await this.pool.query<mysql.RowDataPacket[]>(
      'SELECT * FROM bookings WHERE user_id = ?',
      [userId]
    );
    
    return rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      gameId: row.game_id,
      date: new Date(row.date),
      teamSize: row.team_size,
      totalAmount: row.total_amount,
      isPaid: !!row.is_paid
    }));
  }

  async updateBookingPayment(id: number, isPaid: boolean): Promise<void> {
    await this.pool.query(
      'UPDATE bookings SET is_paid = ? WHERE id = ?',
      [isPaid, id]
    );
  }
}
