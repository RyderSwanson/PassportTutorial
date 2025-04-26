const router = require('express').Router();
const db = require("../models");
const User = db.user;

// Middleware to check if user is authenticated
const isAuthenticated = async (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({message: 'Unauthorized'});
};

// Protected route - only accessible if logged in
router.get('/profile', isAuthenticated, (req, res) => {
  // Don't send password back
  const user = { ...req.user.get() };
  delete user.password;

  res.status(200).json({ user });
});

module.exports = router;
