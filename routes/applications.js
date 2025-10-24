const express = require('express');
const Application = require('../models/Application');
const Scheme = require('../models/Scheme');
const auth = require('../utils/authMiddleware');

const router = express.Router();

router.post('/apply', auth, async (req, res) => {
  const { schemeId, meta } = req.body;
  const scheme = await Scheme.findById(schemeId);
  if (!scheme) return res.status(404).json({ message: 'Scheme not found' });
  const app = await Application.create({ user: req.user._id, scheme: scheme._id, meta });
  // optionally add reference to user.applied (in user model) or query Application directly
  res.json(app);
});

router.get('/my', auth, async (req, res) => {
  const apps = await Application.find({ user: req.user._id }).populate('scheme');
  res.json(apps);
});

module.exports = router;
