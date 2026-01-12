const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/authMiddleware");

// GET messages
router.get("/", auth, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        messages.id,
        messages.text,
        messages.user_id,
        messages.time,
        users.username
      FROM messages
      JOIN users ON users.id = messages.user_id
      ORDER BY messages.time ASC
    `);

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

    const user = await db.query(
      "SELECT username FROM users WHERE id = $1",
      [userId]
    );

    const message = {
      ...result.rows[0],
      username: user.rows[0].username,
    };

    // ✅ SOCKET EVENT (MATCH FRONTEND)
    req.io.emit("messageCreated", message);

    res.json(message);
  } catch (err) {
    console.error("POST /messages error:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// DELETE
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM messages WHERE id = $1", [id]);

    req.io.emit("messageDeleted", { id: Number(id) });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

// EDIT
router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    const result = await db.query(
      `
      UPDATE messages
      SET text = $1
      WHERE id = $2
      RETURNING id, text, user_id, time
      `,
      [text, id]
    );

    const user = await db.query(
      "SELECT username FROM users WHERE id = $1",
      [result.rows[0].user_id]
    );

    const updated = {
      ...result.rows[0],
      username: user.rows[0].username,
    };

    req.io.emit("messageUpdated", updated);

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Edit failed" });
  }
});

module.exports = router;
