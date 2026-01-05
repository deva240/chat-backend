const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/authMiddleware");
router.get("/", auth, async (req, res) => {
const result = await db.query(
"SELECT * FROM messages ORDER BY created_at ASC"
);
res.json(result.rows);
});
router.post("/", auth, async (req, res) => {
const { text } = req.body;
const result = await db.query(
"INSERT INTO messages (text, user_id) VALUES ($1, $2) RETURNING *",
[text, req.user.id]
);
const message = result.rows[0];
req.io.emit("messageCreated", message);
res.json(message);
});
router.put("/:id", auth, async (req, res) => {
const { text } = req.body;
const result = await db.query(
"UPDATE messages SET text=$1, updated_at=NOW() WHERE id=$2 RETURNING *",
[text, req.params.id]
);
req.io.emit("messageUpdated", result.rows[0]);
res.json(result.rows[0]);
});
router.delete("/:id", auth, async (req, res) => {
await db.query("DELETE FROM messages WHERE id=$1", [req.params.id]);
req.io.emit("messageDeleted", { id: req.params.id });
res.json({ success: true });
});
module.exports = router;