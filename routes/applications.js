const express = require('express');
const Application = require('../models/Application');
const Scheme = require('../models/Scheme');
const auth = require('../utils/authMiddleware');

const router = express.Router();

router.get('/debug', (req, res) => {
  res.json({ route: "applications route is mounted correctly" });
});

// Apply to a scheme
router.post('/apply', auth, async (req, res) => {
  try {
    const { schemeId, meta } = req.body;
    
    console.log('📝 Apply request:', { 
      userId: req.user._id, 
      schemeId,
      userIdType: typeof req.user._id,
      schemeIdType: typeof schemeId
    });
    
    // Find the scheme
    const scheme = await Scheme.findById(schemeId);
    if (!scheme) {
      console.log('❌ Scheme not found:', schemeId);
      return res.status(404).json({ message: 'Scheme not found' });
    }
    
    console.log('✅ Scheme found:', scheme["Scheme Name"] || scheme.name);
    
    // Check if already applied
    const existing = await Application.findOne({ 
      user: req.
