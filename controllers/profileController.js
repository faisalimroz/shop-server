const profileController = {
    getProfile: (req, res) => {
      const { username, shops } = req.user;
      res.json({ username, shops });
    },
  };
  
  module.exports = profileController;