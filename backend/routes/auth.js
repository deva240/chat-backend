const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const users = [];

router.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: "User exists" });
  }

  const user = {
    id: users.length + 1,
    username,
    password
  };

  users.push(user);
  res.json({ message: "Registered" });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: "Invalid login" });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET || "secretkey",
    { expiresIn: "1d" }
  );

  res.json({
    token,
    user: { id: user.id, username: user.username }
  });
});

module.exports = router;
