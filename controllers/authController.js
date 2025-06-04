const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { secret, expiresIn } = require("../config/jwt");

const authController = {
  signup: async (req, res, next) => {
    try {
      const { username, password, shops } = req.body;

      if (!username || !password || !Array.isArray(shops) || shops.length < 3) {
        return res.status(400).json({ message: "Please provide username, password, and at least 3 shop names" });
      }

      // Validate shop names
      if (shops.some(shop => !shop.match(/^[a-zA-Z0-9-]+$/))) {
        return res.status(400).json({ message: "Shop names can only contain letters, numbers, and hyphens" });
      }

      const exists = await User.findByUsername(username);
      if (exists) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const duplicateShop = await User.findUserWithShops(shops);
      if (duplicateShop) {
        return res.status(400).json({ message: "One or more shop names are already taken" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.createUser(username, hashedPassword, shops);

      const token = jwt.sign(
        { id: newUser.insertedId.toString(), username, shops },
        secret,
        { expiresIn: expiresIn.long }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: "lax",
        domain: ".localhost",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.status(201).json({
        message: "Signup successful",
        user: { username, shops }
      });
    } catch (err) {
      next(err);
    }
  },

  signin: async (req, res, next) => {
    try {
      const { username, password, remember } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      const user = await User.findByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user._id.toString(), username: user.username, shops: user.shops },
        secret,
        { expiresIn: remember ? expiresIn.long : expiresIn.short }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: "lax",
        domain: ".localhost",
        maxAge: remember ? 7 * 24 * 60 * 60 * 1000 : 30 * 60 * 1000
      });

      res.json({
        message: "Signin successful",
        user: { username: user.username, shops: user.shops }
      });
    } catch (err) {
      next(err);
    }
  },

  logout: (req, res) => {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "lax",
      domain: ".localhost"
    });
    res.json({ message: "Logged out successfully" });
  },

  // New method to verify authentication
  verify: (req, res) => {
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    try {
      const decoded = jwt.verify(token, secret);
      res.json({
        authenticated: true,
        user: {
          username: decoded.username,
          shops: decoded.shops
        }
      });
    } catch (err) {
      res.status(401).json({ message: "Invalid token" });
    }
  }
};

module.exports = authController;