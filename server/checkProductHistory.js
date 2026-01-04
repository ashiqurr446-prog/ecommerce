const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(async () => {
  console.log('✅ MongoDB Connected\n');
  
  try {
    const Product = require('./models/Product');
    
    // Get all products with their timestamps
    const products = await Product.find({}).sort({ createdAt: -1 });
    
    console.log('📦 ALL PRODUCTS WITH TIMESTAMPS:\n');
    console.log('═'.repeat(100));
    
    products.forEach((p, i) => {
      console.log(`\n${i+1}. ${p.name}`);
      console.log(`   Price: ৳${p.price}`);
      console.log(`   Stock: ${p.stock}`);
      console.log(`   Approved: ${p.approved}`);
      console.log(`   Created: ${p.createdAt}`);
      console.log(`   Updated: ${p.updatedAt}`);
      console.log(`   Seller: ${p.seller}`);
    });
    
    console.log('\n' + '═'.repeat(100));
    console.log(`\nTotal Products: ${products.length}`);
    
    // Check if timestamps are working
    const hasTimestamps = products.length > 0 && products[0].createdAt;
    console.log(`\n${hasTimestamps ? '✅' : '❌'} Timestamps are ${hasTimestamps ? 'working' : 'NOT working'}`);
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
})
.catch((err) => {
  console.error('❌ Connection error:', err);
  process.exit(1);
});
