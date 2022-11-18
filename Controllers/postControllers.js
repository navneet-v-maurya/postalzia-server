import Post from "../models/Post.js";
import mongoose from "mongoose";
import User from "../models/User.js";

//create a new post
export const createPost = async (req, res) => {
  const newPost = new Post(req.body);
  try {
    await newPost.save();
    res.status(200).json(newPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//get a post
export const getPost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await Post.findById(id);
    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//update a post
export const updatePost = async (req, res) => {
  const postId = req.params.id;
  const { userId } = req.body;
  try {
    const post = await Post.findById(postId);
    if (post.userId === userId) {
      const updatedPost = await Post.findByIdAndUpdate(postId, req.body, {
        new: true,
      });
      res.status(200).json(updatedPost);
    } else {
      res.status(404).json({ message: "You cannot edit this post" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//delete a post
export const deletePost = async (req, res) => {
  const id = req.params.id;
  const { user } = req.body;
  try {
    const post = await Post.findById(id);
    if (post.userId === user) {
      await post.deleteOne();
      res.status(200).json({ message: "post deleted successfully" });
    } else {
      res.status(404).json({ message: "You cannot delete this post" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// like and dislike a post
export const likePost = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.body;
  try {
    const post = await Post.findById(id);
    if (!post.likes.includes(userId)) {
      await post.updateOne({ $push: { likes: userId } });
      res.status(200).json({ message: " Post Liked" });
    } else {
      await post.updateOne({ $pull: { likes: userId } });
      res.status(200).json({ message: " Post disLiked" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//get timeLine Posts

export const getTimelinePosts = async (req, res) => {
  const userId = req.params.id;
  try {
    const currentUserPosts = await Post.find({ userId: userId });
    const follwingPosts = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "following",
          foreignField: "userId",
          as: "followingPosts",
        },
      },
      {
        $project: {
          followingPosts: 1,
          _id: 0,
        },
      },
    ]);
    res.status(200).json(
      currentUserPosts
        .concat(...follwingPosts[0].followingPosts)
        .sort((a, b) => {
          return b.createdAt - a.createdAt;
        })
    );
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
