const express = require('express');
const Feedback = require('../models/Feedback');
const auth = require('../utils/authMiddleware');

const router = express.Router();

router.post('/', auth, async (req, res) => {
  const { schemeId, rating, comment } = req.body;
  const fb = await Feedback.create({ user: req.user._id, scheme: schemeId, rating, comment });
  res.json(fb);
});

router.get('/scheme/:schemeId', async (req, res) => {
  const all = await Feedback.find({ scheme: req.params.schemeId }).populate('user', 'name');
  res.json(all);
});

module.exports = router;
