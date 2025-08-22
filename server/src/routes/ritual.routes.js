import { Router } from "express";
const router = Router();
import { verifyToken as auth } from "../middlewares/auth.middleware.js";
import { Ritual, User } from "../models/index.js";

router.get("/", auth, async (req, res) => {
  try {
    const filter = {};
    if (req.query.from) filter.from = req.query.from;
    if (req.query.to) filter.to = req.query.to;
    const rituals = await Ritual.find(filter).sort({ createdAt: -1 });
    return res.json(rituals);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { to, name, description, template, frequency } = req.body;
    console.log(req.body)
    if (!to || !name || !frequency) {
      return res
        .status(400)
        .json({ msg: "Missing required fields: to, name, frequency" });
    }
    const toUser = await User.findOne({ email: to });
    const ritual = await Ritual.create({
      from: req.user.id,
      to: toUser,
      name,
      description,
      template,
      frequency,
    });
    return res.json(ritual);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const updated = await Ritual.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ msg: "Not found" });
    return res.json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const deleted = await Ritual.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: "Not found" });
    return res.json({ msg: "Deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
});
export default router;
