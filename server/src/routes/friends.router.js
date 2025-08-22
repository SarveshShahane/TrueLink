import { Router } from "express";
const router = Router();
import { verifyToken as auth } from "../middlewares/auth.middleware.js";
import { Friend } from "../models/index.js";
import mongoose from 'mongoose';



router.get('/search', auth, async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ msg: 'Email required' });
    const users = await Friend.db.model('User').find({ email: { $regex: email, $options: 'i' }, _id: { $ne: req.user.id } })
      .select('firstName lastName email _id');
    return res.json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { friendUserId } = req.body;
    if (!friendUserId) return res.status(400).json({ msg: 'friendUserId required' });
    if (!mongoose.Types.ObjectId.isValid(friendUserId)) {
      return res.status(400).json({ msg: 'Invalid friendUserId' });
    }
    if (friendUserId === req.user.id) return res.status(400).json({ msg: 'Cannot add yourself as friend' });
    const exists = await Friend.findOne({ userId: req.user.id, friendUserId });
    if (exists) return res.status(400).json({ msg: 'Already added as friend' });
    const userDoc = await Friend.db.model('User').findById(friendUserId);
    if (!userDoc) return res.status(404).json({ msg: 'User not found' });
    const friend = await Friend.create({ userId: req.user.id, friendUserId, name: userDoc.firstName + ' ' + userDoc.lastName, email: userDoc.email });
    return res.json(friend);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const friends = await Friend.find({ userId: req.user.id }).sort({ createdAt: -1 })
    return res.json(friends);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const friendId = req.params.id;
    const userId = req.user.id;
    const result = await Friend.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(friendId), userId: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: 'users',
          localField: 'friendUserId',
          foreignField: '_id',
          as: 'friendUserInfo'
        }
      },
      { $unwind: { path: '$friendUserInfo', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          userId: 1,
          friendUserId: 1,
          name: 1,
          email: 1,
          timezone: 1,
          hobbies: 1,
          rituals: 1,
          promptsUsed: 1,
          friendUserInfo: {
            firstName: 1,
            lastName: 1,
            email: 1,
            personalDetails: 1,
            dob:1
          }
        }
      }
    ])
    if (!result || !result.length) return res.status(404).json({ msg: 'Not found' });
    return res.json(result[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const updated = await Friend.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ msg: 'Not found' });
    return res.json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Friend.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deleted) return res.status(404).json({ msg: 'Not found' });
    return res.json({ msg: 'Deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error' });
  }
});
export default router;

