const express = require("express");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

let messages = [];
let id = 1;

router.get("/", auth, (req, res) => {
  res.json(messages);
});

router.post("/", auth, (req, res) => {
  const msg = {
    id: id++,
    text: req.body.text,
    userId: req.user.id,
    username: req.user.username,
    time: new Date()
  };

  messages.push(msg);
  req.io.emit("new_message", msg);
  res.json(msg);
});

router.put("/:id", auth, (req, res) => {
  const msg = messages.find(m => m.id == req.params.id);
  if (!msg) return res.sendStatus(404);
  if (msg.userId !== req.user.id) return res.sendStatus(403);

  msg.text = req.body.text;
  req.io.emit("edit_message", msg);
  res.json(msg);
});

router.delete("/:id", auth, (req, res) => {
  const index = messages.findIndex(m => m.id == req.params.id);
  if (index === -1) return res.sendStatus(404);
  if (messages[index].userId !== req.user.id) return res.sendStatus(403);

  const msgId = messages[index].id;
  messages.splice(index, 1);
  req.io.emit("delete_message", msgId);
  res.sendStatus(204);
});

module.exports = router;
