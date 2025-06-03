const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { secret, expiresIn } = require("../config/jwt");

const authController = {
  signup: async (req, res, next) => {
    try {
      const { username, password, shops } = req.body;

      if (!username || !password || shops.length < 3) {
        return res.status(400).json({ message: "Invalid data" });
      }

      const exists = await User.findByUsername(username);
      if (exists) return res.status(400).json({ message: "User already exists" });

      const duplicateShop = await User.findUserWithShops(shops);
      if (duplicateShop) {
        return res.status(400).json({ message: "Shop name already taken" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.createUser(username, hashedPassword, shops);

    
      const token = jwt.sign({ id: newUser.id, username, shops}, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        domain: "localhost", 
      });


      res.json(
        { message: "Signup successful" });
    } catch (err) {
      next(err);
    }
  },

  signin: async (req, res, next) => {
    try {
      const { username, password, remember } = req.body;
      const user = await User.findByUsername(username);

      if (!user) return res.status(401).json({ message: "User not found" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: "Incorrect password" });

      const token = jwt.sign(
        { username: user.username, shops: user.shops },
        secret,
        { expiresIn: remember ? expiresIn.long : expiresIn.short }
      );

      res.cookie("token", token, {
        httpOnly: true,
        maxAge: remember ? 7 * 24 * 60 * 60 * 1000 : 30 * 60 * 1000,
        secure: false,
        domain: ".localhost",
        sameSite: "lax",
      });

      res.json({ message: "Signin successful" });
    } catch (err) {
      next(err);
    }
  },

  logout: (req, res) => {
    res.clearCookie("token", { domain: ".localhost", sameSite: "lax" });
    res.json({ message: "Logged out" });
  },
};

module.exports = authController;