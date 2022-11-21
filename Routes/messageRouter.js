import express, { Router } from "express";
import { addMessage, getMessages } from "../Controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.post("/", addMessage);
messageRouter.get("/:chatId", getMessages);

export default messageRouter;
