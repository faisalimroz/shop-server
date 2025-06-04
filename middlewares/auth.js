// const jwt = require('jsonwebtoken');
// const { secret } = require('../config/jwt');

// const authMiddleware = async (req, res, next) => {
//   try {
//     const token = req.cookies.token;

//     if (!token) {
//       return res.status(401).json({ message: 'Authentication required' });
//     }

//     const decoded = jwt.verify(token, secret);
    
//     // Extract shop name from subdomain
//     const host = req.get('host');
//     const subdomain = host.split('.')[0];
    
//     // If we're on a shop subdomain, verify shop access
//     if (host !== 'localhost:5000' && !decoded.shops.includes(subdomain)) {
//       return res.status(403).json({ message: 'Access denied to this shop' });
//     }

//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: 'Invalid or expired token' });
//   }
// };

// module.exports = authMiddleware; 
const jwt = require('jsonwebtoken');
const { secret } = require('../config/jwt');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    try {
      const decoded = jwt.verify(token, secret);
      
      // Extract shop name from subdomain
      const host = req.get('host');
      const subdomain = host.split('.')[0];
      
      // If we're on a shop subdomain, verify shop access
      if (host !== 'localhost:5000' && subdomain !== 'localhost' && subdomain !== 'www') {
        if (!decoded.shops.includes(subdomain)) {
          return res.status(403).json({ message: 'Access denied to this shop' });
        }
      }

      req.user = decoded;
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      }
      return res.status(401).json({ message: 'Invalid token' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = authMiddleware; 