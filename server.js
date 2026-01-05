const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const messageRoutes = require("./routes/messages");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 5000;

// -------------------------
// Middleware
// -------------------------
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());

// -------------------------
// Routes
// -------------------------
app.use("/auth", authRoutes);
app.use("/messages", messageRoutes);

// -------------------------
// Create HTTP server
// -------------------------
const server = http.createServer(app);

// -------------------------
// Socket.IO
// -------------------------
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Make io available in routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Socket connection
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

// -------------------------
// Start server
// -------------------------
server.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
