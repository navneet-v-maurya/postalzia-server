import mongoose from "mongoose";

const messaheSchema = mongoose.Schema(
  {
    chatId: {
      type: String,
    },
    senderId: {
      type: String,
    },
    text: {
      type: String,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messaheSchema);
export default Message;
