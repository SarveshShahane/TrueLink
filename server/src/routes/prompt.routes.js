import { Router } from "express";
const router = Router();
import { verifyToken as auth } from "../middlewares/auth.middleware.js";
import { Prompt } from "../models/index.js";


router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const q = category ? { category } : {};
    const prompts = await Prompt.find(q).sort({ createdAt: -1 });
    return res.json(prompts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const prompt = await Prompt.create(req.body);
    return res.json(prompt);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const updated = await Prompt.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ msg: 'Not found' });
    return res.json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Prompt.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: 'Not found' });
    return res.json({ msg: 'Deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

export default router;