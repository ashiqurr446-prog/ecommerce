// createAdmin.js - Create an admin user for testing
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

dotenv.config();

const User = require('./models/User');

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@gmail.com' });
    if (existingAdmin) {
      console.log('⚠️ Admin user already exists');
      await mongoose.disconnect();
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('123', 10);
    const admin = new User({
      username: 'admin',
      email: 'admin@gmail.com',
      password: hashedPassword,
      role: 'admin',
      status: 'active',
      shopName: 'Admin Shop'
    });

    await admin.save();
    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@gmail.com');
    console.log('Password: 123');

    // Create a test seller
    const existingSeller = await User.findOne({ email: 'seller@gmail.com' });
    if (!existingSeller) {
      const sellerPassword = await bcrypt.hash('123456', 10);
      const seller = new User({
        username: 'seller',
        email: 'seller@gmail.com',
        password: sellerPassword,
        role: 'seller',
        status: 'active',
        shopName: 'Test Shop'
      });
      await seller.save();
      console.log('✅ Seller user created successfully!');
      console.log('Email: seller@gmail.com');
      console.log('Password: 123456');
    }

    // Create a test buyer
    const existingBuyer = await User.findOne({ email: 'buyer@gmail.com' });
    if (!existingBuyer) {
      const buyerPassword = await bcrypt.hash('123456', 10);
      const buyer = new User({
        username: 'buyer',
        email: 'buyer@gmail.com',
        password: buyerPassword,
        role: 'buyer',
        status: 'active'
      });
      await buyer.save();
      console.log('✅ Buyer user created successfully!');
      console.log('Email: buyer@gmail.com');
      console.log('Password: 123456');
    }

    await mongoose.disconnect();
    console.log('✅ Done!');
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

createAdmin();
