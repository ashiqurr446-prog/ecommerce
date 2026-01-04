// createSampleProducts.js - Create sample approved products for display
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const Product = require('./models/Product');
const User = require('./models/User');

async function createSampleProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Get or create a seller
    let seller = await User.findOne({ role: 'seller' });
    if (!seller) {
      console.log('⚠️ No seller found. Creating test seller...');
      const seller = new User({
        username: 'testseller',
        email: 'testseller@gmail.com',
        password: 'hashed', // In real app, this would be hashed
        role: 'seller',
        status: 'active',
        shopName: 'Test Products Shop'
      });
      await seller.save();
      console.log('✅ Test seller created');
    }

    seller = await User.findOne({ role: 'seller' });
    
    const sampleProducts = [
      {
        name: 'Premium Laptop',
        category: 'Electronics',
        price: 85000,
        description: 'High-performance laptop with latest specs',
        stock: 10,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600',
        seller: seller._id,
        approved: true,
        rejected: false
      },
      {
        name: 'Wireless Headphones',
        category: 'Electronics',
        price: 4500,
        description: 'Premium noise-cancelling wireless headphones',
        stock: 25,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
        seller: seller._id,
        approved: true,
        rejected: false
      },
      {
        name: 'Smartphone Pro Max',
        category: 'Electronics',
        price: 95000,
        description: 'Latest flagship smartphone with advanced camera',
        stock: 15,
        image: 'https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=600',
        seller: seller._id,
        approved: true,
        rejected: false
      },
      {
        name: 'Running Shoes',
        category: 'Fashion',
        price: 6500,
        description: 'Comfortable and durable running shoes',
        stock: 30,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
        seller: seller._id,
        approved: true,
        rejected: false
      },
      {
        name: 'Cotton T-Shirt',
        category: 'Fashion',
        price: 1200,
        description: 'Premium quality cotton t-shirt',
        stock: 50,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
        seller: seller._id,
        approved: true,
        rejected: false
      },
      {
        name: '4K Camera',
        category: 'Electronics',
        price: 65000,
        description: 'Professional 4K digital camera with lens',
        stock: 8,
        image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=600',
        seller: seller._id,
        approved: true,
        rejected: false
      },
      {
        name: 'Smart Watch',
        category: 'Electronics',
        price: 12000,
        description: 'Feature-rich smartwatch with health tracking',
        stock: 20,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
        seller: seller._id,
        approved: true,
        rejected: false
      },
      {
        name: 'Office Chair',
        category: 'Furniture',
        price: 18000,
        description: 'Ergonomic office chair with lumbar support',
        stock: 12,
        image: 'https://images.unsplash.com/photo-1611947453885-458cbb1b6ee6?w=600',
        seller: seller._id,
        approved: true,
        rejected: false
      },
      {
        name: 'Desk Lamp',
        category: 'Furniture',
        price: 3500,
        description: 'LED desk lamp with adjustable brightness',
        stock: 40,
        image: 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=600',
        seller: seller._id,
        approved: true,
        rejected: false
      },
      {
        name: 'Coffee Maker',
        category: 'Appliances',
        price: 8500,
        description: 'Automatic coffee maker with programmable timer',
        stock: 18,
        image: 'https://images.unsplash.com/photo-1517668808822-9ebb02ae2a0e?w=600',
        seller: seller._id,
        approved: true,
        rejected: false
      }
    ];

    // Check existing products
    const existingCount = await Product.countDocuments({ approved: true });
    console.log(`📦 Found ${existingCount} approved products`);

    if (existingCount === 0) {
      console.log('🆕 Creating sample products...');
      const inserted = await Product.insertMany(sampleProducts);
      console.log(`✅ Created ${inserted.length} sample products!`);
    } else {
      console.log('✅ Approved products already exist. Skipping creation.');
    }

    await mongoose.disconnect();
    console.log('✅ Done!');
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

createSampleProducts();
