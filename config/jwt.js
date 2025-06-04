require('dotenv').config();

const secret = process.env.JWT_SECRET || 'your-secret-key';

if (!process.env.JWT_SECRET) {
  console.warn('Warning: JWT_SECRET not set in environment variables. Using default secret (not recommended for production)');
}

module.exports = {
  secret,
  expiresIn: {
    short: '30m',  
    long: '7d'   
  }
};
