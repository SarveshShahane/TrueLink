import mongoose, { Schema } from "mongoose";

const friendSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    index: true,
  },
  friendUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
  },
  timezone: {
    type: String,
    default: "UTC",
  },
  hobbies: [
    {
      type: String,
    },
  ],
  lastInteraction: {
    type: Date,
  },
  notes: {
    type: String,
  },
  rituals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ritual" }],
  promptsUsed: [{ type: mongoose.Schema.Types.ObjectId, ref: "Prompt" }],
});

const Friend = mongoose.model("Friend", friendSchema);
export default Friend;
