const express = require('express');
const http = require("http");
const dotenv = require('dotenv');
const { Server } = require("socket.io");
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const notificationRoutes = require("./routes/notificationRoutes");
const privatePartyRoutes = require('./routes/privatePartyRoutes');
const analyticsRoutes = require("./routes/analyticsRoutes"); // adjust path if needed

dotenv.config();
connectDB();

const app = express();
const allowedOrigins = [
  'http://localhost:3000',
  'https://eventease-frontend.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS: ' + origin));
    }
  },
  credentials: true
}));


const server = http.createServer(app); // ✅ Create HTTP server
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by socket.io CORS: ' + origin));
      }
    },
    credentials: true,
    methods: ["GET", "POST"],
  },
});


// ✅ Make io globally accessible
global.io = io;

app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/private_party", privatePartyRoutes);
app.use("/api/analytics", analyticsRoutes);

// ✅ Socket.io for Real-time Notifications
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("sendNotification", (data) => {
    io.emit("receiveNotification", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ✅ Use server.listen(), NOT app.listen()
const PORT = process.env.PORT || 5600;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
