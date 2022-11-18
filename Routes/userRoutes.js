import express from "express";
import {
  deleteUser,
  followUser,
  getAllUsers,
  getUser,
  unFollowUser,
  updateUser,
} from "../Controllers/userControllers.js";
import authMiddleware from "../Middleware/authMiddleware.js";

const userRoutes = express.Router();
userRoutes.get("/", getAllUsers);
userRoutes.get("/:id", getUser);
userRoutes.put("/:id", authMiddleware, updateUser);
userRoutes.delete("/:id", authMiddleware, deleteUser);
userRoutes.put("/:id/follow", authMiddleware, followUser);
userRoutes.put("/:id/unfollow", authMiddleware, unFollowUser);

export default userRoutes;
