const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Lấy tất cả sản phẩm
router.get('/items', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Tìm kiếm sản phẩm
router.get('/search', async (req, res) => {
  const { query } = req.query;
  try {
    const products = await Product.find({ title: { $regex: query, $options: 'i' } });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;