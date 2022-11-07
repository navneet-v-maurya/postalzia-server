import User from "../models/User.js";
import bcrypt from "bcrypt";
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
  const { currentUserId, isAdmin, password } = req.body;
  if (currentUserId === id || isAdmin) {
    try {
      if (password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);
      }
      const user = await User.findByIdAndUpdate(id, req.body, { new: true });
      res.status(200).json(user);
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
