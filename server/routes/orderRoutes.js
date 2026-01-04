// server/routes/orderRoutes.js
console.log('🔌 orderRoutes module loaded');

const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const authMiddleware = require('../middleware/authMiddleware');


// GET a specific order by ID
router.get('/:id', async (req, res) => {
  console.log(`📥 GET /api/orders/${req.params.id} hit`);

  try {
    const order = await Order.findById(req.params.id).populate('products.productId');
    if (!order) {
      console.warn("⚠️ Order not found");
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    console.error("❌ Error fetching order by ID:", err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// POST /api/orders — create new order
router.post('/', authMiddleware, async (req, res) => {
  console.log("📨 POST /api/orders hit");
  console.log("📝 Request body:", req.body);

  try {
    const { products, customerName, email, phone, address } = req.body;

    if (
      !products || !Array.isArray(products) || products.length === 0 ||
      !customerName || !email || !phone || !address
    ) {
      return res.status(400).json({ error: 'Missing or invalid required fields' });
    }

    
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

  
    const phoneRegex = /^[+\d\-\s()]{7,20}$/;
    if (!phoneRegex.test(phone)) {
      console.warn('⚠️ Invalid phone format:', phone);
      return res.status(400).json({ error: 'Invalid phone number format (must be 7-20 characters with digits, +, -, space, or parentheses)' });
    }

    
    const userId = req.user && req.user.id ? req.user.id : undefined;
    const newOrder = new Order({ userId, products, customerName, email, phone, address });
    const savedOrder = await newOrder.save();

    console.log("✅ Order saved:", savedOrder._id);
    res.status(201).json({ message: '✅ Order saved successfully', order: savedOrder });
  } catch (error) {
    console.error('❌ Order save error:', error.message);
    console.error('❌ Full error:', error);
    
    // Check if it's a validation error
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ error: 'Validation error: ' + messages.join(', ') });
    }
    
    res.status(500).json({ error: 'Order could not be saved: ' + error.message });
  }
});


module.exports = router;
