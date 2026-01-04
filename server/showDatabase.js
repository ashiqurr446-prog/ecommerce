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
    const db = mongoose.connection.db;
    
    console.log('🗄️  MONGODB DATABASE STRUCTURE\n');
    console.log('═'.repeat(85));
    
    // Get collection stats
    const collections = await db.listCollections().toArray();
    
    console.log('\n📦 Collections in "ecommerce" database:\n');
    
    for (const collection of collections) {
      const collectionName = collection.name;
      const count = await db.collection(collectionName).countDocuments();
      console.log(`  ✓ ${collectionName.padEnd(15)} → ${count} documents`);
    }
    
    console.log('\n═'.repeat(85));
    console.log('\n📊 DETAILED LOOK AT "products" COLLECTION:\n');
    
    const productsCollection = db.collection('products');
    const products = await productsCollection.find({}).limit(2).toArray();
    
    console.log(`Total products: ${await productsCollection.countDocuments()}\n`);
    
    if (products.length > 0) {
      console.log('Sample Product Structure:');
      console.log('─'.repeat(85));
      
      const product = products[0];
      console.log(`
{
  _id: "${product._id}",
  name: "${product.name}",
  price: ${product.price},
  stock: ${product.stock},
  approved: ${product.approved},
  seller: "${product.seller}",
  image: "${product.image || 'cloudinary-url'}",
  description: "${product.description}",
  reviews: [${product.reviews ? product.reviews.length : 0} items],
  history: [${product.history ? product.history.length : 0} entries],  ← PRODUCT HISTORY ARRAY
  createdAt: "${product.createdAt}",
  updatedAt: "${product.updatedAt}"
}`);
      
      console.log('\n═'.repeat(85));
      console.log('\n🎯 WHAT GETS STORED IN "history" ARRAY:\n');
      
      if (product.history && product.history.length > 0) {
        console.log(`This product has ${product.history.length} history entry(ies):\n`);
        product.history.forEach((entry, i) => {
          console.log(`  History Entry ${i + 1}:`);
          console.log(`  {`);
          console.log(`    action: "${entry.action}",`);
          console.log(`    changedByName: "${entry.changedByName}",`);
          console.log(`    timestamp: "${entry.timestamp}"`);
          if (entry.changes) {
            console.log(`    changes: {`);
            console.log(`      field: "${entry.changes.field}",`);
            if (entry.changes.oldValue !== undefined) {
              console.log(`      oldValue: ${JSON.stringify(entry.changes.oldValue)},`);
            }
            if (entry.changes.newValue !== undefined) {
              console.log(`      newValue: ${JSON.stringify(entry.changes.newValue)}`);
            }
            console.log(`    }`);
          }
          console.log(`  }`);
          console.log('');
        });
      } else {
        console.log(`This product is ready to have history tracked!`);
        console.log(`Next time admin makes a change, a history entry will be created.\n`);
        console.log(`Example of what will be stored:`);
        console.log(`{
  action: "price_changed",
  changedByName: "admin@gmail.com",
  changes: {
    field: "price",
    oldValue: ${product.price},
    newValue: ${product.price * 0.9}
  },
  timestamp: ISODate("${new Date().toISOString()}")
}`);
      }
    }
    
    console.log('\n═'.repeat(85));
    console.log('\n✅ READY TO START TRACKING!\n');
    console.log('To see history being tracked:');
    console.log('  1. Go to admin.html');
    console.log('  2. Edit a product price');
    console.log('  3. Run: node showFeatures.js');
    console.log('  4. History entries will appear in MongoDB!\n');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
})
.catch((err) => {
  console.error('❌ Connection error:', err.message);
  process.exit(1);
});
