import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import dotenv from "dotenv";
import connectDB from "./config/db.config.js";
import { startReminderScheduler } from "./utils/cronJobs.js";


import authRoutes from "./routes/auth.routes.js";
import friendRoutes from "./routes/friends.router.js";
import reminderRoutes from "./routes/remainder.routes.js";
import ritualRoutes from "./routes/ritual.routes.js";
import promptRoutes from "./routes/prompt.routes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors({
	origin: process.env.FRONTEND_URL || 'http://localhost:5173',
	credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => res.send("TrueLink API is running"));

app.use("/api/auth", authRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/rituals", ritualRoutes);
app.use("/api/prompts", promptRoutes);

export { app };
