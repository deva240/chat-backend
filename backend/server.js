const express = require("express");
const auth = require("../middleware/authMiddleware");
const Message = require("../models/Message");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  const messages = await Message.find().populate("user", "username");
  res.json(messages);
});

router.post("/", auth, async (req, res) => {
  const msg = await Message.create({
    text: req.body.text,
    user: req.user.id
  });

  const populated = await msg.populate("user", "username");
  req.io.emit("new_message", populated);
  res.json(populated);
});

module.exports = router;
