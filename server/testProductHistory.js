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
    const User = require('./models/User');
    const Product = require('./models/Product');
    
    // Get a product and show its history
    const product = await Product.findOne({ name: /HP|laptop/i }).populate('history.changedBy', 'email name');
    
    if (!product) {
      console.log('❌ No product found');
      process.exit(1);
    }
    
    console.log('📦 PRODUCT DETAILS:');
    console.log('═'.repeat(80));
    console.log(`Name: ${product.name}`);
    console.log(`Price: ৳${product.price}`);
    console.log(`Stock: ${product.stock}`);
    console.log(`Approved: ${product.approved}`);
    console.log(`Created: ${product.createdAt}`);
    console.log(`Updated: ${product.updatedAt}`);
    
    console.log('\n📋 PRODUCT HISTORY:');
    console.log('═'.repeat(80));
    
    if (product.history && product.history.length > 0) {
      product.history.forEach((entry, i) => {
        console.log(`\n${i+1}. Action: ${entry.action.toUpperCase()}`);
        console.log(`   Changed By: ${entry.changedByName || 'System'}`);
        console.log(`   Timestamp: ${entry.timestamp}`);
        if (entry.changes && entry.changes.field) {
          console.log(`   Field: ${entry.changes.field}`);
          if (entry.changes.oldValue !== undefined) {
            console.log(`   Old Value: ${entry.changes.oldValue}`);
          }
          if (entry.changes.newValue !== undefined) {
            console.log(`   New Value: ${entry.changes.newValue}`);
          }
        }
      });
    } else {
      console.log('No history entries yet.');
    }
    
    console.log('\n' + '═'.repeat(80));
    
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
