
require('dotenv').config();

const secret = process.env.JWT_SECRET;

module.exports = {
  secret,
  expiresIn: {
    short: '30m',  
    long: '7d'   
  }
};
