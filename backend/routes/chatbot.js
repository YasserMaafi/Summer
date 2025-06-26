// backend/routes/chatbot.js
const express = require("express");
const router = express.Router();
const db = require("../db"); // your configured pg Pool or client

// POST /api/chatbot
router.post("/", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "No message provided" });

    // Simple keyword extraction: lowercase + split words
    const words = message.toLowerCase().split(/\s+/);

    // Query DB for any matching keywords
    // For simplicity, match any keyword that appears in the message words
    const queryText = `
      SELECT response FROM chatbot_responses
      WHERE keyword = ANY($1)
      LIMIT 1
    `;
    const result = await db.query(queryText, [words]);

    if (result.rows.length > 0) {
      return res.json({ reply: result.rows[0].response });
    } else {
      return res.json({ reply: "Sorry, I didn't understand that. Can you rephrase?" });
    }
  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
