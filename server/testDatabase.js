const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

console.log('🔍 Testing MongoDB Connection...\n');
console.log('Connection URI:', process.env.MONGO_URI ? '✅ Found' : '❌ Missing');
console.log('MONGO_URI:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(async () => {
  console.log('\n✅ MongoDB Connected Successfully!\n');
  
  try {
    // Check all collections
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log('📊 Collections in Database:');
    collections.forEach(col => console.log(`  - ${col.name}`));
    
    // Get counts for each collection
    const User = require('./models/User');
    const Product = require('./models/Product');
    const Order = require('./models/Order');
    
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();
    
    console.log('\n📈 Data Count:');
    console.log(`  Users: ${userCount}`);
    console.log(`  Products: ${productCount}`);
    console.log(`  Orders: ${orderCount}`);
    
    // Show sample data
    if (productCount > 0) {
      console.log('\n📦 Sample Products:');
      const products = await Product.find().limit(3);
      products.forEach((p, i) => {
        console.log(`  ${i+1}. ${p.name} - ৳${p.price} (Approved: ${p.approved})`);
      });
    } else {
      console.log('\n⚠️  No products found in database');
    }
    
    if (userCount > 0) {
      console.log('\n👥 Sample Users:');
      const users = await User.find().limit(3).select('username email role');
      users.forEach((u, i) => {
        console.log(`  ${i+1}. ${u.username} (${u.email}) - ${u.role}`);
      });
    }
    
    if (orderCount > 0) {
      console.log('\n📋 Sample Orders:');
      const orders = await Order.find().limit(3);
      orders.forEach((o, i) => {
        console.log(`  ${i+1}. ${o.customerName} - ${o.products.length} items - Status: ${o.status}`);
      });
    }
    
    console.log('\n✅ Database is working correctly!');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Error reading data:', err.message);
    process.exit(1);
  }
})
.catch((err) => {
  console.error('\n❌ MongoDB Connection Failed:', err.message);
  console.error('\nPossible issues:');
  console.error('  1. MONGO_URI not set in .env file');
  console.error('  2. MongoDB Atlas cluster is paused');
  console.error('  3. IP address not whitelisted in MongoDB');
  console.error('  4. Network connectivity issue');
  process.exit(1);
});
