const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(async () => {
  console.log('✅ MongoDB connected');
  
  try {
    // Find and delete the SmokeTest product
    const result = await Product.deleteOne({ name: 'SmokeTest Product' });
    
    if (result.deletedCount > 0) {
      console.log('✅ Deleted SmokeTest Product');
    } else {
      console.log('⚠️ SmokeTest Product not found');
    }
    
    // Show remaining products
    const products = await Product.find({});
    console.log(`\n📦 Remaining products (${products.length} total):`);
    products.forEach(p => {
      console.log(`  - ${p.name} (Approved: ${p.approved})`);
    });
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});
