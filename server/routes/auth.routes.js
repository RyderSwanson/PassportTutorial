const router = require('express').Router();
const bcrypt = require('bcryptjs');
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
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user
    const user = await User.findOne({ where: { username } });
    
    if (!user) {
      return res.status(401).json({ message: "Incorrect username or password" });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect username or password" });
    }
    
    // Create simple session
    req.session.userId = user.id;
    
    // Don't send password back
    const userResponse = { ...user.get() };
    delete userResponse.password;
    
    res.status(200).json({
      message: "Logged in successfully",
      user: userResponse
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: "Could not log out" });
    }
    res.status(200).json({ message: "Logged out successfully" });
  });
});

// Check if user is authenticated
router.get('/check', async (req, res) => {
  if (req.session.userId) {
    try {
      const user = await User.findByPk(req.session.userId);
      if (user) {
        // Don't send password back
        const userResponse = { ...user.get() };
        delete userResponse.password;
        return res.status(200).json({ isAuthenticated: true, user: userResponse });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  
  res.status(200).json({ isAuthenticated: false });
});

module.exports = router;
