// Import dependencies
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define MongoDB Schemas
const customerSchema = new mongoose.Schema({
  name: String,
  email: String,
  retentionStatus: String, // e.g., 'active', 'inactive'
});
const bookingSchema = new mongoose.Schema({
  customerId: mongoose.Schema.Types.ObjectId,
  slotTime: Date,
  status: String, // e.g., 'confirmed', 'cancelled'
});

const Customer = mongoose.model("Customer", customerSchema);
const Booking = mongoose.model("Booking", bookingSchema);

// API to create a booking
app.post("/api/book-slot", async (req, res) => {
  try {
    const { customerId, slotTime } = req.body;
    const booking = new Booking({ customerId, slotTime, status: "confirmed" });
    await booking.save();
    res.json({ message: "Booking confirmed", booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API to get all bookings
app.get("/api/get-bookings", async (_req, res) => {
  try {
    const bookings = await Booking.find().populate("customerId");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API to get customer retention data
app.get("/api/get-customer-retention", async (_req, res) => {
  try {
    const retentionStats = await Customer.aggregate([
      { $group: { _id: "$retentionStatus", count: { $sum: 1 } } },
    ]);
    res.json(retentionStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
