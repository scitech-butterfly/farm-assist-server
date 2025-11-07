const express = require('express');
const Application = require('../models/Application');
const Scheme = require('../models/Scheme');
const auth = require('../utils/authMiddleware');

const router = express.Router();

router.get('/debug', (req, res) => {
  res.json({ route: "applications route is mounted correctly" });
});


// ✅ APPLY TO SCHEME
router.post('/apply', auth, async (req, res) => {
  try {
    const { schemeId, meta } = req.body;

    console.log('📝 Apply request:', { userId: req.user._id, schemeId });

    // ✅ Find the scheme
    const scheme = await Scheme.findById(schemeId);
    if (!scheme) {
      console.log('❌ Scheme not found:', schemeId);
      return res.status(404).json({ message: 'Scheme not found' });
    }

    console.log('✅ Scheme found:', scheme.name);

    // ✅ Prevent duplicate applications
    const existing = await Application.findOne({
      user: req.user._id,
      scheme: schemeId
    });

    if (existing) {
      return res.status(400).json({
        message: 'Already applied to this scheme',
        application: existing
      });
    }

    // ✅ Create new application
    const app = await Application.create({
      user: req.user._id,
      scheme: schemeId,
      status: 'submitted',
      meta
    });

    console.log('✅ Application created:', app._id);

    res.json({
      success: true,
      message: 'Application submitted successfully',
      application: app
    });

  } catch (err) {
    console.error('❌ Error in /apply:', err);
    res.status(500).json({ message: 'Server error applying to scheme' });
  }
});


// ✅ GET USER'S APPLICATIONS
router.get('/my', auth, async (req, res) => {
  try {
    console.log('🔍 Fetching applications for user:', req.user._id);

    const apps = await Application.find({ user: req.user._id })
      .populate('scheme')
      .sort({ appliedAt: -1 });

    console.log(`✅ Found ${apps.length} applications`);

    // ✅ Format the output
    const formatted = apps.map(app => {
      if (!app.scheme) {
        return {
          applicationId: app._id,
          schemeId: null,
          schemeTitle: "Scheme Not Found",
          schemeDescription: "",
          appliedAt: app.appliedAt,
          status: app.status
        };
      }

      return {
        applicationId: app._id,
        schemeId: app.scheme._id,
        schemeTitle: app.scheme.name || "Untitled Scheme",
        schemeDescription: app.scheme.description || "",
        appliedAt: app.appliedAt,
        status: app.status
      };
    });

    console.log('✅ Formatted applications:', formatted);

    res.json({ applications: formatted });

  } catch (err) {
    console.error("❌ Error loading applications:", err);
    res.status(500).json({
      message: "Server error loading applications",
      error: err.message
    });
  }
});

module.exports = router;
