const express = require("express");
const { verifyShop } = require("../controllers/shopController");
const { verifyToken } = require("../middlewares/authMiddleware");
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.get("/verify-shop", verifyToken, verifyShop);

// Get shop details
router.get('/details', authMiddleware, (req, res) => {
  const host = req.get('host');
  const shopName = host.split('.')[0];
  
  res.json({
    name: shopName,
    owner: req.user.username,
    message: `This is ${shopName} shop`
  });
});

module.exports = router;
