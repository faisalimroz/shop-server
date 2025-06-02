const shopController = {
    verifyShop: (req, res) => {
      const { shop } = req.query;
  
      if (!shop) {
        return res.status(400).json({ message: "Shop name is required" });
      }
  
      const { shops } = req.user;
  
      if (!shops.includes(shop)) {
        return res.status(403).json({
          message: "Unauthorized access to shop",
          code: "SHOP_ACCESS_DENIED",
        });
      }
  
      res.json({
        success: true,
        shop,
        username: req.user.username,
        allShops: shops,
      });
    },
  };
  
  module.exports = shopController;