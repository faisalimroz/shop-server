const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const { connectDB } = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const shopRoutes = require("./routes/shopRoutes");
const FRONTEND_URL = process.env.NODE_ENV === 'production'
  ? `https://${process.env.FRONTEND_DOMAIN}`
  : "http://localhost:5173";
const app = express();
const PORT = process.env.PORT || 5000;

// Simple CORS configuration
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

connectDB();

app.use("/api", authRoutes);
app.use("/api", profileRoutes);
app.use("/api", shopRoutes);

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: err.message || "Something went wrong!" });
});

app.get("/", (req, res) => {
  res.send("API is running");
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));


