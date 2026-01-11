const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/authMiddleware");

// GET messages
router.get("/", auth, async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM messages ORDER BY time ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("GET /messages error:", err.message);
    res.status(500).json({ error: "Failed to load messages" });
  }
});

// POST message
router.post("/", auth, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text required" });
    }

    const userId = req.user.id;

    const result = await db.query(
      `INSERT INTO messages (text, user_id)
       VALUES ($1, $2)
       RETURNING *`,
      [text, userId]
    );

    const message = result.rows[0];

    // 🔥 THIS WAS MISSING — REALTIME UPDATE
    req.io.emit("new_message", message);

    res.status(201).json(message);
  } catch (err) {
    console.error("POST /messages error:", err.message);
    res.status(500).json({ error: "Failed to send message" });
  }
});

module.exports = router;
