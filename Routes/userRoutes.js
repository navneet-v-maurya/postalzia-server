import express from "express";
import {
  deleteUser,
  getUser,
  updateUser,
} from "../Controllers/userControllers.js";

const userRoutes = express.Router();
userRoutes.get("/:id", getUser);
userRoutes.put("/:id", updateUser);
userRoutes.delete("/:id", deleteUser);

export default userRoutes;
