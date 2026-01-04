const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(async () => {
  console.log('✅ MongoDB connected\n');
  
  try {
    // Get all products
    const allProducts = await Product.find({});
    
    console.log('📸 ALL PRODUCT IMAGE LINKS:\n');
    console.log('═'.repeat(80));
    
    allProducts.forEach((p, index) => {
      console.log(`\n${index + 1}. ${p.name}`);
      console.log(`   Status: ${p.approved ? '✅ APPROVED' : '⏳ PENDING'}`);
      console.log(`   Price: ৳${p.price}`);
      console.log(`   Image URL:`);
      if (p.image) {
        console.log(`   ${p.image}`);
      } else {
        console.log(`   (No image)`);
      }
    });
    
    console.log('\n' + '═'.repeat(80));
    console.log(`\nTotal Products: ${allProducts.length}`);
    console.log(`Approved: ${allProducts.filter(p => p.approved).length}`);
    console.log(`Pending: ${allProducts.filter(p => !p.approved).length}`);
    
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
