import { Router } from "express";
const router = Router();
import { verifyToken as auth } from "../middlewares/auth.middleware.js";
import { Remainder } from "../models/index.js";

router.post("/", auth, async (req, res) => {
  try {
    const reminder = await Remainder.create({
      userId: req.user.id,
      ...req.body,
    });
    return res.json(reminder);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const reminders = await Remainder.find({ userId: req.user.id }).sort({
      scheduledTime: 1,
    });
    return res.json(reminders);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const r = await Remainder.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!r) return res.status(404).json({ msg: "Not found" });
    return res.json(r);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const updated = await Remainder.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ msg: "Not found" });
    return res.json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const deleted = await Remainder.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!deleted) return res.status(404).json({ msg: "Not found" });
    return res.json({ msg: "Deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
});
export default router;

