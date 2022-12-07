import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import authRoute from "./Routes/authRoute.js";
import userRoutes from "./Routes/userRoutes.js";
import postRoute from "./Routes/postRoute.js";
import dotenv from "dotenv";
import chatRouter from "./Routes/chatRoute.js";
import messageRouter from "./Routes/messageRouter.js";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
dotenv.config();
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

const PORT = process.env.PORT || 5000;

//socket server
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "https://postalzia.netlify.app",
  },
});

let activeUsers = [];

//socket functions
io.on("connection", (socket) => {
  socket.on("new-user-add", (newUserId) => {
    if (activeUsers.find((user) => user.userId === newUserId) === undefined) {
      activeUsers.push({
        userId: newUserId,
        socketId: socket.id,
      });
    }

    socket.emit("get-users", activeUsers);
  });

  socket.on("send-message", (data) => {
    const user = data.onlineUsers.find((u) => u.userId === data.receiverId);

    if (user !== undefined) {
      socket.to(user.socketId).emit("receive-message", data.socketmessage);
    }
  });

  socket.on("disconnect", () => {
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    socket.emit("get-users", activeUsers);
  });
});

//mongodb connection
mongoose
  .connect(process.env.URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(
    httpServer.listen(PORT, () => {
      console.log(`server connected to port ${PORT}`);
    })
  )
  .catch((error) => {
    console.log(error);
  });

app.use("/auth", authRoute);
app.use("/user", userRoutes);
app.use("/post", postRoute);
app.use("/chat", chatRouter);
app.use("/message", messageRouter);
app.use("/", (req, res) => {
  res.send("hello to memories api");
});
