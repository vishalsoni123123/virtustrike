
import { User, Game, Booking } from './mongo-db';
import { InsertGame, InsertUser, InsertBooking } from '@shared/schema';

export class MongoDBStorage {
  async getGames() {
    return await Game.find().lean();
  }

  async getGame(gameId: string) {
    return await Game.findById(gameId).lean();
  }

  async getUserByUsername(username: string) {
    return await User.findOne({ username }).lean();
  }

  async getUser(userId: string) {
    return await User.findById(userId).lean();
  }

  async createUser(userData: InsertUser) {
    const user = new User(userData);
    await user.save();
    return user.toObject();
  }

  async getUserBookings(userId: string) {
    return await Booking.find({ userId })
      .populate('gameId')
      .lean();
  }

  async createBooking(bookingData: InsertBooking) {
    const booking = new Booking(bookingData);
    await booking.save();
    return booking.toObject();
  }

  async updateBookingPayment(bookingId: string, isPaid: boolean) {
    await Booking.findByIdAndUpdate(bookingId, { isPaid });
  }

  async getBookingsByDate(date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    return await Booking.find({
      date: { $gte: startOfDay, $lte: endOfDay }
    }).lean();
  }
}
