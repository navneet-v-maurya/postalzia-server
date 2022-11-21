import express from "express";
import {
  createChat,
  findChat,
  userChats,
} from "../Controllers/chatController.js";
const chatRouter = express.Router();

chatRouter.post("/", createChat);
chatRouter.get("/:userId", userChats);
chatRouter.get("/find/:firstId/:secondId", findChat);

export default chatRouter;
