import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

//get allUsers
export const getAllUsers = async (req, res) => {
  try {
    const data = await User.find();
    const allUsers = data.map((user) => {
      const { password, ...otherDatils } = user._doc;
      return otherDatils;
    });
    res.status(200).json(allUsers);
  } catch (error) {
    console.log({ message: error.message });
  }
};

//get a user
export const getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (user) {
      const { password, ...rest } = user._doc;
      return res.status(200).json(rest);
    }
    res.status(404).json({ message: "user not found" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//update a user
export const updateUser = async (req, res) => {
  const id = req.params.id;
  const { _id, isAdmin, password } = req.body;
  if (_id === id || isAdmin) {
    try {
      if (password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);
      }
      const user = await User.findByIdAndUpdate(id, req.body, { new: true });
      const token = jwt.sign(
        { userName: user.userName, id: user._id },
        process.env.KEY,
        {
          expiresIn: "1h",
        }
      );
      res.status(200).json({ user, token });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(404).json({ message: "Access Denied!!" });
  }
};

//delete a user
export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const { currentUserId, isAdmin } = req.body;
  if (currentUserId === id || isAdmin) {
    try {
      await User.findByIdAndDelete(id);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(404).json({ message: "Acess denied!!" });
  }
};

//follow a user
export const followUser = async (req, res) => {
  const id = req.params.id;
  const { _id } = req.body;
  if (id === _id) {
    return res.status(403).json({ message: "Action forbidden" });
  }
  try {
    const followedbyUser = await User.findById(id);
    const tobeFollowesUser = await User.findById(_id);

    if (!followedbyUser || !tobeFollowesUser) {
      return res.status(404).json({ message: "No such users exists" });
    }

    if (followedbyUser.following.includes(_id)) {
      return res.status(401).json({ message: "you already follow this user" });
    }

    await followedbyUser.updateOne({ $push: { following: _id } });
    await tobeFollowesUser.updateOne({ $push: { followers: id } });
    res.status(200).json({ message: "User followed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// unfollow a user
export const unFollowUser = async (req, res) => {
  const id = req.params.id;
  const { _id } = req.body;
  if (id === _id) {
    return res.status(403).json({ message: "Action forbidden" });
  }
  try {
    const unfollowedByUser = await User.findById(id);
    const toBeUnfollowedUser = await User.findById(_id);

    if (!unfollowedByUser || !toBeUnfollowedUser) {
      return res.status(404).json({ message: "No such users exists" });
    }

    if (!unfollowedByUser.following.includes(_id)) {
      return res.status(401).json({ message: "you dont follow this user" });
    }

    await unfollowedByUser.updateOne({
      $pull: { following: _id },
    });
    await toBeUnfollowedUser.updateOne({ $pull: { followers: id } });
    res.status(200).json({ message: "User unfollowed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
