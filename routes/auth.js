const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// POST /auth/register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'Email đã được đăng ký' });

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'Đăng ký thành công' });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    console.log(`Auth user: ${JSON.stringify(user)} - ${email}`);
    if (!user) return res.status(400).json({ message: 'Email không tồn tại' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Mật khẩu không đúng' });

    const payload = { id: user._id, email: user.email };
    console.log(`Auth payload: ${JSON.stringify(payload)} - secret ${process.env.JWT_SECRET}`);
    // const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    // console.log(`Auth token: ${JSON.stringify(token)}`);

    res.json({ message : payload });
  } catch (error) {
    console.log(`Auth error: ${JSON.stringify(error)}`);
    
    res.status(500).json({ message: error });
  }
});

module.exports = router;
