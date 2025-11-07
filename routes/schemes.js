const express = require('express');
const Scheme = require('../models/Scheme');
const fetch = require('node-fetch');

const router = express.Router();

// ✅ List all schemes
router.get('/', async (req, res) => {
  try {
    const schemes = await Scheme.find().limit(200);
    res.json(schemes);
  } catch (err) {
    console.error("Error fetching schemes:", err);
    res.status(500).json({ message: "Server error fetching schemes" });
  }
});

// ✅ Get a single scheme by ID
router.get('/:id', async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    if (!scheme) return res.status(404).json({ message: 'Scheme not found' });
    res.json(scheme);
  } catch (err) {
    console.error("Error fetching scheme:", err);
    res.status(500).json({ message: "Server error fetching scheme" });
  }
});

// ✅ Search endpoint (supports NLP API or fallback MongoDB search)
router.post('/search', async (req, res) => {
  const { query } = req.body;
  const NLP = process.env.NLP_API;

  if (NLP) {
    try {
      const response = await fetch(NLP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question : query })   // ✅ only query
      });

      const data = await response.json();

      // Handle the response based on your FastAPI structure
      if (data.found && data.scheme_name) {
        // Return the scheme data
        return res.json({
          found: true,
          scheme: {
            name: data.scheme_name,
            link: data.link,
            eligibility: data.eligibility,
            benefits: data.benefits,
            description: data.description,
            formatted_answer: data.formatted_answer
          }
        });
      } else {
        return res.json({
          found: false,
          message: data.formatted_answer || "योजना सापडली नाही"
        });
      }

      if (data.schemeIds) {
        const results = await Scheme.find({ _id: { $in: data.schemeIds } });
        return res.json(results);
      }

      if (data.schemes) return res.json(data.schemes);

    } catch (e) {
      console.warn('NLP failed', e.message);
    }
  }

  // ✅ fallback simple regex search
  if (!query) return res.json([]);

  try {
    const regex = new RegExp(query, "i");
    const schemes = await Scheme.find({
      $or: [
        { name: regex },
        { description: regex },
        { eligibility: regex },
        { benefits: regex },
      ],
    });
    return res.json({ schemes });
  } catch (err) {
    return res.status(500).json({ message: "Error searching schemes" });
  }
});

module.exports = router;
