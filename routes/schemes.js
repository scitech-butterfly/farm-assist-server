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
  const { query, crops } = req.body;
  const NLP = process.env.NLP_API;

  // 1️⃣ If NLP API configured, use that
  if (NLP) {
    try {
      const response = await fetch(NLP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, crops })
      });
      const data = await response.json();
      if (data.schemeIds) {
        const results = await Scheme.find({ _id: { $in: data.schemeIds } });
        return res.json(results);
      }
      if (data.schemes) return res.json(data.schemes);
    } catch (e) {
      console.warn('NLP API failed:', e.message);
    }
  }

  // 2️⃣ Fallback: MongoDB regex search
  if (query) {
    try {
      const regex = new RegExp(query, "i");
      const schemes = await Scheme.find({
        $or: [
          { name: regex },
          { description: regex },
          { eligibility: regex },
          { benefits: regex },
          { faqs: regex },
          { keywords: { $in: [regex] } }
        ]
      }).limit(100);
      return res.json(schemes);
    } catch (err) {
      console.error("Regex search error:", err);
      return res.status(500).json({ message: "Error searching schemes" });
    }
  }

  // 3️⃣ Fallback: MongoDB full-text search (index-based)
  try {
    const results = await Scheme.find({ $text: { $search: query } }).limit(50);
    res.json(results);
  } catch (err) {
    console.error("Text search error:", err);
    res.status(500).json({ message: "Text search failed" });
  }
});

module.exports = router;
