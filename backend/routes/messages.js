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
    const userId = req.user.id;

    const result = await db.query(
      `
      INSERT INTO messages (text, user_id)
      VALUES ($1, $2)
      RETURNING id, text, user_id, time
      `,
      [text, userId]
    );

    const message = result.rows[0];

    // 🔥 EMIT REALTIME MESSAGE
    req.io.emit("new_message", message);

    res.json(message);
  } catch (err) {
    console.error("POST /messages error:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
});


module.exports = router;
