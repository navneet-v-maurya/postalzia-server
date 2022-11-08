import express from "express";
import {
  createPost,
  deletePost,
  getPost,
  getTimelinePosts,
  likePost,
  updatePost,
} from "../Controllers/postControllers.js";

const postRoute = express.Router();

postRoute.post("/", createPost);
postRoute.get("/:id", getPost);
postRoute.put("/:id", updatePost);
postRoute.delete("/:id", deletePost);
postRoute.put("/:id/like", likePost);
postRoute.get("/:id/timeline", getTimelinePosts);

export default postRoute;
