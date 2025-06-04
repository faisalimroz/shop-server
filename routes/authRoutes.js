const express = require("express");
const { signup, signin, logout, verify } = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/logout", logout);
router.get("/verify", verify);

module.exports = router;