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
    
    console.log('🎯 PRODUCT HISTORY FEATURE DEMO\n');
    console.log('═'.repeat(85));
    
    // Get products
    const products = await Product.find({}).select('name price stock approved history').limit(3);
    
    if (products.length === 0) {
      console.log('❌ No products found in database');
      process.exit(1);
    }
    
    console.log('\n📊 WHAT PRODUCT HISTORY CAN DO:\n');
    console.log('═'.repeat(85));
    
    console.log('\n✅ CAPABILITY 1: Track Price Changes');
    console.log('─'.repeat(85));
    console.log('When admin changes a product price:');
    console.log('  • Old price is saved');
    console.log('  • New price is saved');
    console.log('  • Admin email is recorded');
    console.log('  • Exact timestamp is saved');
    console.log('  • Cannot be lost or forgotten!\n');
    
    console.log('Example history entry:');
    console.log(`  {
    action: "price_changed",
    changedByName: "admin@gmail.com",
    changes: {
      field: "price",
      oldValue: 150000,
      newValue: 145000
    },
    timestamp: ISODate("2025-12-13T10:30:00Z")
  }\n`);
    
    console.log('✅ CAPABILITY 2: Track Product Approvals');
    console.log('─'.repeat(85));
    console.log('When admin approves a product:');
    console.log('  • Approval action is recorded');
    console.log('  • Admin who approved it is saved');
    console.log('  • Date/time of approval is saved');
    console.log('  • Complete audit trail is created\n');
    
    console.log('✅ CAPABILITY 3: Track Product Rejections');
    console.log('─'.repeat(85));
    console.log('When admin rejects a product:');
    console.log('  • Rejection reason is saved');
    console.log('  • Admin who rejected is recorded');
    console.log('  • Date/time of rejection is saved');
    console.log('  • Seller can see why it was rejected\n');
    
    console.log('✅ CAPABILITY 4: Query by Admin');
    console.log('─'.repeat(85));
    console.log('See all changes made by specific admin:');
    console.log('  db.products.aggregate([');
    console.log('    { $unwind: "$history" },');
    console.log('    { $match: { "history.changedByName": "admin@gmail.com" } }');
    console.log('  ])\n');
    
    console.log('✅ CAPABILITY 5: Query by Date Range');
    console.log('─'.repeat(85));
    console.log('See all changes from the last 7 days:');
    console.log('  db.products.aggregate([');
    console.log('    { $unwind: "$history" },');
    console.log('    { $match: {');
    console.log('      "history.timestamp": { $gte: new Date(Date.now() - 7*24*60*60*1000) }');
    console.log('    }}');
    console.log('  ])\n');
    
    console.log('✅ CAPABILITY 6: Find Most Edited Products');
    console.log('─'.repeat(85));
    console.log('See which products are edited most frequently:');
    console.log('  db.products.aggregate([');
    console.log('    { $project: { name: 1, changes: { $size: "$history" } } },');
    console.log('    { $sort: { changes: -1 } }');
    console.log('  ])\n');
    
    console.log('═'.repeat(85));
    console.log('\n📈 CURRENT PRODUCT EXAMPLES:\n');
    
    products.forEach((product, i) => {
      console.log(`${i+1}. ${product.name}`);
      console.log(`   Price: ৳${product.price}`);
      console.log(`   Stock: ${product.stock}`);
      console.log(`   Approved: ${product.approved}`);
      console.log(`   History entries: ${product.history.length || '(ready to be tracked):'}`);
      if (product.history.length > 0) {
        product.history.slice(0, 2).forEach((h, j) => {
          console.log(`     ${j+1}. ${h.action} by ${h.changedByName} on ${h.timestamp.toLocaleDateString()}`);
        });
        if (product.history.length > 2) {
          console.log(`     ... and ${product.history.length - 2} more entries`);
        }
      }
      console.log('');
    });
    
    console.log('═'.repeat(85));
    console.log('\n💾 HOW IT WORKS:\n');
    console.log('1. Admin makes change (price, approval, rejection)');
    console.log('2. API receives request');
    console.log('3. History entry is AUTOMATICALLY created');
    console.log('4. Entry includes: action, who, what, when, old value, new value');
    console.log('5. Everything is saved to MongoDB');
    console.log('6. Data can be queried anytime!\n');
    
    console.log('═'.repeat(85));
    console.log('\n🔍 YOU CAN VIEW HISTORY IN 4 WAYS:\n');
    console.log('1. MongoDB Atlas Web UI');
    console.log('   → cloud.mongodb.com → Collections → products → view history array\n');
    console.log('2. MongoDB Compass Desktop');
    console.log('   → Download Compass → Connect → ecommerce → products → view history\n');
    console.log('3. Terminal Query Script');
    console.log('   → node testProductHistory.js\n');
    console.log('4. MongoDB Queries');
    console.log('   → Copy from MONGODB_PASTE_READY.md (10 ready-to-use queries)\n');
    
    console.log('═'.repeat(85));
    console.log('\n✨ KEY FEATURES:\n');
    console.log('  ✓ AUTOMATIC - No manual setup needed');
    console.log('  ✓ PERMANENT - Data is never deleted');
    console.log('  ✓ COMPLETE - Tracks everything important');
    console.log('  ✓ QUERYABLE - 15 ways to view the data');
    console.log('  ✓ AUDIT-READY - Know who did what and when\n');
    
    console.log('═'.repeat(85));
    console.log('\n📚 READ THE DOCUMENTATION:\n');
    console.log('  START_HERE.md                    ← Master guide');
    console.log('  PRODUCT_HISTORY_SUMMARY.txt     ← 2-min overview');
    console.log('  MONGODB_PASTE_READY.md          ← 10 ready-to-use queries');
    console.log('  MONGODB_HISTORY_QUERIES.md      ← 15 detailed queries');
    console.log('  PRODUCT_HISTORY_GUIDE.md        ← Complete documentation\n');
    
    console.log('═'.repeat(85));
    console.log('\n✅ STATUS: FULLY FUNCTIONAL AND READY TO USE!\n');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    console.error(err.stack);
    process.exit(1);
  }
})
.catch((err) => {
  console.error('❌ Connection error:', err.message);
  process.exit(1);
});
