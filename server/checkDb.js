// server/checkDb.js
// Connects to MongoDB and prints counts and recent documents for verification
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();
const uri = process.env.MONGO_URI;
if (!uri) {
  console.error('✖ MONGO_URI is not set in server/.env');
  process.exit(1);
}

const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

(async () => {
  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB for inspection');

    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();

    console.log(`Users: ${userCount}, Products: ${productCount}, Orders: ${orderCount}`);

    const recentUsers = await User.find({}, '-password').sort({ _id: -1 }).limit(5).lean();
    const recentProducts = await Product.find().sort({ _id: -1 }).limit(5).lean();
    const recentOrders = await Order.find().sort({ _id: -1 }).limit(5).lean();

    console.log('\n--- Recent Users (max 5) ---');
    recentUsers.forEach(u => console.log(u));

    console.log('\n--- Recent Products (max 5) ---');
    recentProducts.forEach(p => console.log(p));

    console.log('\n--- Recent Orders (max 5) ---');
    recentOrders.forEach(o => console.log(o));

    // quick lookups for test accounts
    const seller = await User.findOne({ email: 'test_seller@example.com' }, '-password').lean();
    const buyer = await User.findOne({ email: 'test_buyer@example.com' }, '-password').lean();
    console.log('\nTest accounts:');
    console.log('seller:', seller ? seller._id : 'NOT FOUND');
    console.log('buyer: ', buyer ? buyer._id : 'NOT FOUND');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error inspecting DB:', err);
    process.exit(1);
  }
})();
