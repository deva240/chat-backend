const express = require("express");
const auth = require("../middleware/authMiddleware");
const pool = require("../db");

const router = express.Router();

/* GET messages */
router.get("/", auth, async (req, res) => {
  const result = await pool.query(`
    SELECT messages.id, messages.text, messages.created_at,
           users.username
    FROM messages
    JOIN users ON users.id = messages.user_id
    ORDER BY messages.created_at ASC
  `);

  res.json(result.rows);
});

/* POST message */
router.post("/", auth, async (req, res) => {
  const { text } = req.body;

  const result = await pool.query(
    "INSERT INTO messages (text, user_id) VALUES ($1,$2) RETURNING id, text, created_at",
    [text, req.user.id]
  );

  const message = {
    ...result.rows[0],
    username: req.user.username,
  };

  req.io.emit("new_message", message);
  res.json(message);
});

module.exports = router;
