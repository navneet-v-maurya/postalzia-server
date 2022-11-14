import mongoose from "mongoose";
const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    profilePic: String,
    coverPic: String,
    about: String,
    livesIn: String,
    country: String,
    worksAt: String,
    relationshipStatus: String,
    followers: [],
    following: [],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
