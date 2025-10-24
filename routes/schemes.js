const express = require('express');
const Scheme = require('../models/Scheme');
const fetch = require('node-fetch'); // optional if calling NLP

const router = express.Router();

// list all schemes
router.get('/', async (req, res) => {
  const schemes = await Scheme.find().limit(200);
  res.json(schemes);
});

// get single by id
router.get('/:id', async (req, res) => {
  const s = await Scheme.findById(req.params.id);
  if (!s) return res.status(404).json({ message: 'Not found' });
  res.json(s);
});

// search: prefer NLP API (if configured), else text search
router.post('/search', async (req, res) => {
  const { query, crops } = req.body;
  const NLP = process.env.NLP_API;
  if (NLP) {
    try {
      const response = await fetch(NLP, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, crops })
      });
      const data = await response.json();
      if (data.schemeIds) {
        const results = await Scheme.find({ _id: { $in: data.schemeIds } });
        return res.json(results);
      }
      if (data.schemes) return res.json(data.schemes);
    } catch (e) {
      console.warn('NLP failed', e.message);
    }
  }
  // fallback: Mongo text search
  if (!query) return res.json([]);
  const results = await Scheme.find({ $text: { $search: query } }).limit(50);
  res.json(results);
});

module.exports = router;
