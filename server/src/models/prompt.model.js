import mongoose, { Schema } from "mongoose";

const promptSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    category: {
      type: String,
      enum: ["emotional", "reflective", "casual"],
      default: "casual",
    },
  },
  { timestamps: true }
);

const Prompt = mongoose.model("Prompt", promptSchema);
export default Prompt;
