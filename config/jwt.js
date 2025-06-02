module.exports = {
    secret: process.env.JWT_SECRET,
    expiresIn: {
      short: "30m",
      long: "7d",
    },
  };