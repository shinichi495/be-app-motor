const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const products  = require('./routes/products');
// const authMiddleware = require('./middleware/auth'); // nếu bạn dùng xác thực sau này

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/motor';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Kết nối MongoDB thành công'))
.catch(err => console.error('❌ Lỗi kết nối MongoDB:', err));

// Routes
app.use('/auth', authRoutes);
app.use('/apis', products);


// Route test mặc định
app.get('/', (req, res) => {
  console.log('Route / đã được gọi');
  res.send('🚀 API AppBike đang hoạt động!');
});


// Route mẫu có middleware (chưa bật)
/// app.get('/profile', authMiddleware, (req, res) => {
//   res.json({ message: `Chào bạn, userId: ${req.user.id}` });
// });

// Start server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
