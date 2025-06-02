const express = require("express");
const { verifyShop } = require("../controllers/shopController");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/verify-shop", verifyToken, verifyShop);

module.exports = router;