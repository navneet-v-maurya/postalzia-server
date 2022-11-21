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

const app = express();
dotenv.config();
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(
    app.listen(PORT, () => {
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
