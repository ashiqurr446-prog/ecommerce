// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`➡️ Incoming request: ${req.method} ${req.url}`);
  next();
});

// API routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Determine correct client path
// In local dev: __dirname = .../server, so go up to root, then into client
// In Render: code runs from server dir, so we need to resolve from project root
const clientPath = path.join(__dirname, '..', 'client');
const absoluteClientPath = path.resolve(clientPath);

console.log(`📁 Client path: ${absoluteClientPath}`);

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(absoluteClientPath));

app.get('/', (req, res) => {
  const homeFile = path.join(absoluteClientPath, 'home.html');
  console.log(`🏠 Serving home from: ${homeFile}`);
  res.sendFile(homeFile, (err) => {
    if (err) {
      console.error(`❌ Failed to serve home.html: ${err.message}`);
      res.status(404).send('home.html not found');
    }
  });
});

// Connect to MongoDB with enhanced options and error handling
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  maxPoolSize: 50,
  minPoolSize: 10
})
.then(() => {
  console.log('✅ MongoDB connected');
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}/home.html`);
  });
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Add reconnection and error handling
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected! Attempting to reconnect...');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error('❌ GLOBAL ERROR:', {
    message: err.message,
    stack: err.stack,
    status: err.status || 500,
    type: err.constructor.name
  });
  
  res.status(err.status || 500).json({ 
    message: 'Server error: ' + err.message,
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});