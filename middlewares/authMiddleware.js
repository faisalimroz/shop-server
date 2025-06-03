const jwt = require("jsonwebtoken");
const { secret } = require("../config/jwt");

function verifyToken(req, res, next) {
  const token = req.cookies.token;
  
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = { verifyToken };
// const verifyToken = (req, res, next) => {
//   const token = req.cookies.token; // Get token from cookies
//   if (!token) {
//     return res.status(401).json({ message: "Unauthorized: Token not found" });
//   }

//   try {
//     const decoded = jwt.verify(token, secret);
//     req.user = decoded; 
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: "Unauthorized: Invalid token" });
//   }
// };

// module.exports = { verifyToken };