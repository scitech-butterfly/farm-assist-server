const express = require('express');
const Feedback = require('../models/Feedback');
const auth = require('../utils/authMiddleware');

const router = express.Router();

// ✅ Submit feedback
router.post('/', auth, async (req, res) => {
  try {
    const { schemeId, rating, comment } = req.body;

    if (!schemeId || !rating) {
      return res.status(400).json({
        success: false,
        message: "schemeId and rating are required"
      });
    }

    const fb = await Feedback.create({
      user: req.user._id,
      scheme: schemeId,
      rating,
      comment
    });

    return res.json({
      success: true,
      message: "Feedback submitted",
      feedback: fb
    });

  } catch (err) {
    console.error("❌ Error submitting feedback:", err);
    return res.status(500).json({
      success: false,
      message: "Server error submitting feedback"
    });
  }
});

// ✅ Get all feedback for a scheme
router.get('/scheme/:schemeId', async (req, res) => {
  try {
    const all = await Feedback.find({ scheme: req.params.schemeId })
      .populate('user', 'name');

    return res.json({
      success: true,
      feedback: all
    });

  } catch (err) {
    console.error("❌ Error loading feedback:", err);
    return res.status(500).json({
      success: false,
      message: "Server error loading feedback"
    });
  }
});

module.exports = router;
