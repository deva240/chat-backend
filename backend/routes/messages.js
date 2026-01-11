const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/authMiddleware");

/* =========================
   GET ALL MESSAGES
========================= */
router.get("/", auth, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        messages.id,
        messages.text,
        messages.time,
        messages.user_id,
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

/* =========================
   CREATE MESSAGE
========================= */
router.post("/", auth, async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.user.id;

    if (!text) {
      return res.status(400).json({ error: "Text required" });
    }

    const result = await db.query(
      `
      INSERT INTO messages (text, user_id)
      VALUES ($1, $2)
      RETURNING
        id,
        text,
        user_id,
        time,
        (SELECT username FROM users WHERE id = $2) AS username
      `,
      [text, userId]
    );

    const message = result.rows[0];

    // 🔥 REALTIME CREATE
    req.io.emit("new_message", message);

    res.status(201).json(message);
  } catch (err) {
    console.error("POST /messages error:", err.message);
    res.status(500).json({ error: "Failed to send message" });
  }
});

/* =========================
   UPDATE MESSAGE
========================= */
router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    const result = await db.query(
      `
      UPDATE messages
      SET text = $1
      WHERE id = $2
      RETURNING
        id,
        text,
        user_id,
        time,
        (SELECT username FROM users WHERE id = user_id) AS username
      `,
      [text, id]
    );

    const updated = result.rows[0];

    // 🔥 REALTIME EDIT
    req.io.emit("edit_message", updated);

    res.json(updated);
  } catch (err) {
    console.error("PUT /messages error:", err.message);
    res.status(500).json({ error: "Edit failed" });
  }
});

/* =========================
   DELETE MESSAGE
========================= */
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM messages WHERE id = $1", [id]);

    // 🔥 REALTIME DELETE
    req.io.emit("delete_message", Number(id));

    res.json({ success: true });
  } catch (err) {
    console.error("DELETE /messages error:", err.message);
    res.status(500).json({ error: "Delete failed" });
  }
});

module.exports = router;
