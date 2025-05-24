const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const auth = require('../middleware/auth');

// Lấy danh sách tin nhắn
router.get('/', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ senderId: req.user.userId }, { receiverId: req.user.userId }],
    }).populate('senderId receiverId', 'name');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Gửi tin nhắn
router.post('/', auth, async (req, res) => {
  const { receiverId, message } = req.body;
  try {
    const newMessage = new Message({
      senderId: req.user.userId,
      receiverId,
      message,
    });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;