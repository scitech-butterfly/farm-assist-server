const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

const router = express.Router();

// register
router.post('/register', async (req, res) => {
  const { name, password, age, gender, crops, familySize, landSize, queryId } = req.body;
  if (!name || !password) return res.status(400).json({ message: 'Missing fields' });
  try {
    const existing = await User.findOne({ name });
    if (existing) return res.status(409).json({ message: 'User exists' });
    
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Create user with passwordHash (but model expects 'password' field)
    const user = await User.create({ 
      name, 
      password: passwordHash,  // Changed from passwordHash to password
      age, 
      gender, 
      crops,
      familySize,
      landSize,
      queryId
    });
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        age, 
        gender, 
        crops,
        familySize,
        landSize
      } 
    });
  } catch (err) { 
    console.error('Registration error:', err);
    res.status(500).json({ message: err.message }); 
  }
});

// login
router.post('/login', async (req, res) => {
  const { name, password } = req.body;
  try {
    const user = await User.findOne({ name });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    
    // Compare with the password field (which contains the hash)
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        age: user.age, 
        gender: user.gender, 
        crops: user.crops,
        familySize: user.familySize,
        landSize: user.landSize
      } 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
