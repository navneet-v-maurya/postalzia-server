import express from "express";
import {
  deleteUser,
  followUser,
  getAllUsers,
  getUser,
  unFollowUser,
  updateUser,
} from "../Controllers/userControllers.js";

const userRoutes = express.Router();
userRoutes.get("/", getAllUsers);
userRoutes.get("/:id", getUser);
userRoutes.put("/:id", updateUser);
userRoutes.delete("/:id", deleteUser);
userRoutes.put("/:id/follow", followUser);
userRoutes.put("/:id/unfollow", unFollowUser);

export default userRoutes;
