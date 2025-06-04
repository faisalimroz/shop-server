// const express = require("express");
// const { verifyShop } = require("../controllers/shopController");
// const { verifyToken } = require("../middlewares/authMiddleware");
// const authMiddleware = require('../middlewares/auth');

// const router = express.Router();

// router.get("/verify-shop", verifyToken, verifyShop);

// // Get shop details
// router.get('/details', authMiddleware, (req, res) => {
//   const host = req.get('host');
//   const shopName = host.split('.')[0];
  
//   res.json({
//     name: shopName,
//     owner: req.user.username,
//     message: `This is ${shopName} shop`
//   });
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');

// Get user's shops
router.get('/shops', authMiddleware, (req, res) => {
  res.json({
    shops: req.user.shops
  });
});

// Get specific shop details
router.get('/shops/:shopName', authMiddleware, (req, res) => {
  const { shopName } = req.params;
  
  // Verify user has access to this shop
  if (!req.user.shops.includes(shopName)) {
    return res.status(403).json({ message: 'Access denied to this shop' });
  }

  res.json({
    name: shopName,
    owner: req.user.username
  });
});

module.exports = router;