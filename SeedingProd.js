// seed.js

// 1. Cài đặt dependencies:
//    npm install mongoose @faker-js/faker

const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');

// 2. Định nghĩa schema
const productSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  price:       { type: String, required: true },
  image:       { type: String, required: true },
  description: { type: String },
  createdAt:   { type: Date,   default: Date.now },
});

const Product = mongoose.model('Product', productSchema);

// 3. Kết nối tới MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/motor';
mongoose.connect(MONGO_URI, {
  useNewUrlParser:    true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

function createFakeProduct() {
  return {
    title:       faker.commerce.productName(),
    price:       faker.commerce.price(10, 200, 2, '$'),
    image:       faker.image.urlLoremFlickr({
  width: 640,
  height: 480,
  category: 'product',
  randomize: true
}),
    description: faker.commerce.productDescription(),
  };
}

async function seedProducts(count = 50) {
  try {
    await Product.deleteMany({});
    console.log('🗑️  Old products removed');

    const products = [];
    for (let i = 0; i < count; i++) {
      products.push(createFakeProduct());
    }

    const inserted = await Product.insertMany(products);
    console.log(`✨ Inserted ${inserted.length} products`);
  } catch (err) {
    console.error('❌ Seed error:', err);
  } finally {
    mongoose.disconnect();
  }
}

seedProducts(100); // Thay 100 thành số lượng sản phẩm bạn muốn tạo
