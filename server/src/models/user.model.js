import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      default: null,
    },
    timezone: {
      type: String,
      default: "UTC",
    },
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "Friend",
      },
    ],
    personalDetails: {
      interests: [{ type: String }],
      lifeEvents: [{ type: String }],
      conversationHistories: [
        {
          with: { type: Schema.Types.ObjectId, ref: "User" },
          messages: [{ type: String }],
          lastUpdated: { type: Date },
        },
      ],
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.method.matchPassword = async (password) => {
  return bcrypt.compare(this.password, password);
};

const User = mongoose.model("User", userSchema);
export default User;
