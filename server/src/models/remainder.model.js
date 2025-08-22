import mongoose, { Schema } from "mongoose";

const remainderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    friendId: {
      type: Schema.Types.ObjectId,
      ref: "Friend",
      index: true,
    },
    type: {
      type: String,
      enum: ["birthday", "weekly_checkin", "ritual", "custom"],
      default: "custom",
    },
    message: { type: String, required: true },
    scheduledTime: { type: Date, required: true },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Remainder = mongoose.model("Remainder", remainderSchema);
export default Remainder;
