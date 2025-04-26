const router = require('express').Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const db = require("../models");
const User = db.user;

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      where: { 
        [db.Sequelize.Op.or]: [{ username }, { email }] 
      } 
    });
    
    if (existingUser) {
      return res.status(400).json({ message: "Username or email already exists" });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword
    });
    
    // Don't send password back
    newUser.password = undefined;
    
    res.status(201).json({
      message: "User registered successfully",
      user: newUser
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Basic login
router.post('/login', async (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({message: info.message});
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }

      user.password = undefined;

      return res.status(200).json({
        message: "Logged in successfully",
        user
      });
    });
  })(req, res, next);
});

// Logout
router.post('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) {
      return next(err);
    }
    res.status(200).json({message: "logged out successfully"});
  })
});

// Check if user is authenticated
router.get('/check', (req, res) => {
  if (req.session.userId) {
    req.user.password = undefined;
    res.status(200).json({isAuthenticated: true, user: req.user});
  } else {
    res.status(200).json({isAuthenticated: false});
  }
});

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

module.exports = router;
