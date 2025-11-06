// routes/queryRoutes.js
const express = require("express");
const router = express.Router();
const UserQuery = require("../models/UserQuery");

// POST /api/query — save anonymous user query
router.post("/", async (req, res) => {
  try {
    const saved = await UserQuery.create(req.body);
    return res.json(saved);
  } catch (err) {
    console.error("Error saving user query:", err);
    return res.status(500).json({ error: "Failed to save query" });
  }
});

module.exports = router;
