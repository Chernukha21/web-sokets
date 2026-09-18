const mongoose = require("mongoose");

const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    body: {
      type: String,
      required: true,
      trim: true,
      match: /^.*\S.*$/,
      minLength: 1,
    },
    roomId: {
      type: String,
      required: true,
      enum: ["general", "frontend", "backend"],
      default: "general",
      index: true,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
