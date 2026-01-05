const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const messageRoutes = require("./routes/messages");
const authRoutes = require("./routes/auth");
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({
  origin: "*",
  credentials: true
}));

app.use(express.json());
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Make io available to routes
app.use((req, res, next) => {
req.io = io;
next();
});
app.use("/auth", authRoutes);
app.use("/messages", messageRoutes);
io.on("connection", (socket) => {
console.log("Socket connected:", socket.id);
});
server.listen(5000, () => {
console.log("Server running on http://localhost:5000");
});
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});