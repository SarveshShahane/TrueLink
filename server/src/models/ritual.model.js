import mongoose, { Schema } from "mongoose";

const ritualSchema = new Schema(
  {
    from:{type: Schema.Types.ObjectId, ref: "User", required: true},
    to:{type: Schema.Types.ObjectId, ref: "User", required: true},
    name: { type: String, required: true },
    description: { type: String },
    template: { type: String },
    frequency: { type: String, enum: ["daily", "weekly", "monthly"] },
     lastSentAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const Ritual = mongoose.model("Ritual", ritualSchema);
export default Ritual;
