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

router.post('/search', async (req, res) => {
  const { query } = req.body;
  const NLP = process.env.NLP_API;

  // ✅ No query? return empty list
  if (!query || !query.trim()) {
    return res.json({ schemes: [] });
  }

  // ✅ Try NLP API first
  if (NLP) {
    try {
      const response = await fetch(NLP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: query })
      });

      const data = await response.json();

      // ✅ NLP FOUND EXACT SCHEME
      if (data.found && data.scheme_name) {
        return res.json({
          schemes: [
            {
              name: data.scheme_name,
              link: data.link,
              eligibility: data.eligibility,
              benefits: data.benefits,
              description: data.description,
              formatted_answer: data.formatted_answer
            }
          ]
        });
      }

      // ✅ NLP did not find a match → return empty list
      return res.json({
        schemes: [],
        message: data.formatted_answer || "No matching scheme found."
      });

    } catch (err) {
      console.warn("NLP failed:", err.message);
    }
  }

  // ✅ Fallback search in MongoDB
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
    console.error("Fallback search error:", err);
    return res.status(500).json({ message: "Error searching schemes" });
  }
});

module.exports = router;
