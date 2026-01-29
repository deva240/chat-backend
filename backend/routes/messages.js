const express = require("express");
const auth = require("../middleware/authMiddleware");
const pool = require("../db");

const router = express.Router();

/* =======================
   GET messages
======================= */
router.get("/", auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        messages.id,
        messages.text,
        messages.updated_at,
        users.username,
        users.id AS user_id
      FROM messages
      JOIN users ON users.id = messages.user_id
      ORDER BY messages.updated_at ASC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("GET /messages ERROR:", err);
    res.status(500).json({ message: "Failed to load messages" });
  }
});

/* =======================
   POST message
======================= */
router.post("/", auth, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Message text required" });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await pool.query(
      `
      INSERT INTO messages (text, user_id)
      VALUES ($1, $2)
      RETURNING id, text, updated_at
      `,
      [text, req.user.id]
    );

    const message = {
      ...result.rows[0],
      username: req.user.username,
      user_id: req.user.id,
    };

    req.io.emit("new_message", message);
    res.json(message);
  } catch (err) {
    console.error("POST /messages ERROR:", err);
    res.status(500).json({ message: "Failed to send message" });
  }
});

/* =======================
   PUT message (EDIT)
======================= */
router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    const result = await pool.query(
      `
      UPDATE messages
      SET text = $1, updated_at = NOW()
      WHERE id = $2 AND user_id = $3
      RETURNING id, text, updated_at
      `,
      [text, id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const updated = {
      ...result.rows[0],
      username: req.user.username,
      user_id: req.user.id,
    };

    req.io.emit("edit_message", updated);
    res.json(updated);
  } catch (err) {
    console.error("PUT /messages ERROR:", err);
    res.status(500).json({ message: "Failed to edit message" });
  }
});

/* =======================
   DELETE message
======================= */
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM messages
      WHERE id = $1 AND user_id = $2
      RETURNING id
      `,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ message: "Not allowed" });
    }

    req.io.emit("delete_message", Number(id));
    res.json({ success: true });
  } catch (err) {
    console.error("DELETE /messages ERROR:", err);
    res.status(500).json({ message: "Failed to delete message" });
  }
});

module.exports = router;
