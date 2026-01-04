// server/testMongo.js
// Simple script to test MongoDB connection using MONGO_URI from .env
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error('✖ MONGO_URI is not set. Please create a server/.env with MONGO_URI or set the environment variable.');
  process.exit(1);
}

(async () => {
  try {
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected successfully');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('MongoDB connection error:');
    console.error(err);
    process.exit(1);
  }
})();
