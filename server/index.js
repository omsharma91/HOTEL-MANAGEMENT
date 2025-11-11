const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const roomRoutes = require('./routes/roomRoutes')
const bookingRoutes = require('./routes/bookingRoutes');
const hotelRoutes = require('./routes/hotelRoutes')
const paymentRoutes = require('./routes/paymentRoutes')
const reportRoutes  = require('./routes/reportRoutes.js')
const inventoryRoutes = require("./routes/inventoryRoutes");


const app = express();

// app.use(cors());
app.use(cors());
app.use(express.json());

connectDB();

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/payment", paymentRoutes)
app.use("/api/reports", reportRoutes);
app.use("/api/inventory", inventoryRoutes);

app.get("/", (req, res) => {
  res.send("Hotel Management API is running...");
});

app.listen(process.env.Port,() => console.log( 'server is running at 5000'))

module.exports = app;