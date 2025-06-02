function handleError(res, message, code = 500) {
    res.status(code).json({ message });
  }
  
  module.exports = { handleError };