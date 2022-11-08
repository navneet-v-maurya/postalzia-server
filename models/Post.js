import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    likes: [],
    description: String,
    image: String,
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
