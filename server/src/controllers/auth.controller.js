import { User } from "../models/index.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

import { generateToken, verifyToken, clearToken } from "../middlewares/auth.middleware.js";
import bcrypt from "bcryptjs";


const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }
  const newUser = new User({ firstName, lastName, email, password });
  await newUser.save();
  const token = generateToken(res, newUser);
  return res.status(201).json({
    message: "User registered successfully",
    token,
    user: { id: newUser._id, firstName, lastName, email }
  });
});


const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  const token = generateToken(res, user);
  return res.status(200).json({
    message: "User logged in successfully",
    token,
    user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email }
  });
});


const logout = asyncHandler(async (req, res) => {
  clearToken(res);
  return res.status(200).json({ message: "User logged out successfully" });
});

const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    personalDetails: user.personalDetails,
    dob: user.dob ,
    timezone: user.timezone
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { interests, lifeEvents, conversationHistories } = req.body.personalDetails || {};
  let { dob } = req.body;
  const update = {};
  if(req.body.timezone) update['timezone'] = req.body.timezone;
  if (interests) update['personalDetails.interests'] = interests;
  if (lifeEvents) update['personalDetails.lifeEvents'] = lifeEvents;
  if (conversationHistories) update['personalDetails.conversationHistories'] = conversationHistories;
  if (dob !== undefined) {
    if (dob === '') {
      update['dob'] = null;
    } else {
      update['dob'] = new Date(dob);
    }
  }
  const user = await User.findByIdAndUpdate(userId, { $set: update }, { new: true }).select('-password');
  console.log(user)
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    dob: user.dob,
    personalDetails: user.personalDetails
  });
});

export { register, login, logout, me, updateUser };

