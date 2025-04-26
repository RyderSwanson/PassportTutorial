const router = require('express').Router();
const db = require("../models");
const User = db.user;

// Middleware to check if user is authenticated
const isAuthenticated = async (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const user = await User.findByPk(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Protected route - only accessible if logged in
router.get('/profile', isAuthenticated, (req, res) => {
  // Don't send password back
  const user = { ...req.user.get() };
  delete user.password;

  res.status(200).json({ user });
});

module.exports = router;
