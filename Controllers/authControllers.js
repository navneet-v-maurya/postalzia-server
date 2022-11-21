import User from "../models/User.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
//register a new user
export const register = async (req, res) => {
  const { userName, password, firstName, lastName } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(password, salt);

  const newUser = new User({
    userName,
    password: hashedPass,
    firstName,
    lastName,
  });
  try {
    if (await User.findOne({ userName })) {
      return res
        .status(404)
        .json({ message: "user with this username alreday exists" });
    }
    const user = await newUser.save();

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//login a user
export const login = async (req, res) => {
  const { userName, password } = req.body;

  try {
    const user = await User.findOne({ userName });
    if (user) {
      const validPass = await bcrypt.compare(password, user.password);
      if (!validPass) {
        return res.status(403).json({ message: "Wrong password" });
      }

      return res.status(200).json({ user });
    }
    res
      .status(404)
      .json({ message: "user with the given username does not exists" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
