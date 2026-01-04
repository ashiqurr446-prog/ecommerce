const express = require('express');

const router = express.Router();
const Product = require('../models/Product');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const path = require('path');

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ecommerce-products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [{ width: 600, height: 600, crop: 'limit' }]
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpg, png, gif)'), false);
    }
  }
});


router.get('/:id/reviews', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product.reviews || []);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
});

// Post a review 
router.post('/:id/reviews', authMiddleware, async (req, res) => {
  const { comment, rating } = req.body;
  if (!rating || rating < 1 || rating > 5) return res.status(400).json({ message: 'Invalid rating' });
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const review = {
      user: req.user.id,
      username: req.user.username,
      comment: comment || '',
      rating: Number(rating),
      createdAt: new Date()
    };
    product.reviews.push(review);
    await product.save();
    res.status(201).json({ message: 'Review added', review });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add review' });
  }
});

// --- Recommended Products ---
router.get('/:id/recommend', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const recs = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      approved: true,
      rejected: false
    }).limit(5);
    res.json(recs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch recommendations' });
  }
});

//routes/productRoutes.js
console.log('🔌 productRoutes module loaded');



// PATCH: Update product stock/quantity (admin only)
router.patch('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product updated', product });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', details: Object.values(err.errors).map(e => e.message) });
    }
    res.status(500).json({ message: 'Failed to update product' });
  }
});

// PATCH: Update product price (admin only)
router.patch('/:id/price', authMiddleware, adminMiddleware, async (req, res) => {
  const { price } = req.body;
  
  if (price === undefined || price === null || price === '') {
    return res.status(400).json({ message: 'Price is required' });
  }
  
  const numPrice = Number(price);
  if (isNaN(numPrice)) {
    return res.status(400).json({ message: 'Price must be a valid number' });
  }
  if (numPrice < 0) {
    return res.status(400).json({ message: 'Price cannot be negative' });
  }

  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    
    const oldPrice = product.price;
    
    // Add to history
    product.history.push({
      action: 'price_changed',
      changedByName: req.user.email,
      changes: {
        field: 'price',
        oldValue: oldPrice,
        newValue: numPrice
      }
    });
    
    // Update price
    product.price = numPrice;
    await product.save();
    
    console.log(`✅ Product ${product._id} price updated from ৳${oldPrice} to ৳${numPrice} by ${req.user.email}`);
    res.json({ message: 'Price updated successfully', product });
  } catch (err) {
    console.error('❌ Error updating price:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', details: Object.values(err.errors).map(e => e.message) });
    }
    res.status(500).json({ message: 'Failed to update price', error: err.message });
  }
});

router.get('/pending-debug', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const pending = await Product.find({ approved: false, rejected: false });
    res.json(pending);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching pending products (debug)' });
  }
});



router.get('/pending', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    console.log('🔐 Authenticated user:', req.user);
    const pending = await Product.find({ approved: false, rejected: false }).populate('seller', 'username');
    console.log('✅ Fetched pending products:', pending);
    res.json(pending);
  } catch (err) {
    console.error('❌ Error in /pending:', err.stack || err);
    res.status(500).json({ message: 'Error fetching pending products' });
  }
});




router.patch('/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
  const { status, reason } = req.body;
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    
    const update = {
      approved: status === 'approved',
      rejected: status === 'rejected',
    };
    if (status === 'rejected') {
      update.rejectionReason = reason || '';
    } else {
      update.rejectionReason = '';
    }
    
    // Add to history
    product.history.push({
      action: status === 'approved' ? 'approved' : 'rejected',
      changedByName: req.user.email,
      changes: {
        field: status,
        oldValue: status === 'approved' ? false : false,
        newValue: true
      }
    });
    
    // Update product
    Object.assign(product, update);
    await product.save();
    
    console.log(`✅ Product ${product._id} ${status} by ${req.user.email}`);
    res.json({ message: `Product ${status}` });
  } catch (err) {
    console.error('❌ Error updating product status:', err);
    res.status(500).json({ message: 'Failed to update product status' });
  }
});

// Get all products
router.get('/', async (req, res) => {
  console.log("📥 GET /api/products hit");

  const { approvedOnly } = req.query;
  let query = {};
  if (approvedOnly === 'true') {
    query = { approved: true, rejected: false };
  }

  try {
    let products;
    let isAdmin = false;
    if (req.headers && req.headers.authorization) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const jwt = require('jsonwebtoken');
        const secret = process.env.JWT_SECRET || 'secret';
        const decoded = jwt.verify(token, secret);
        if (decoded && decoded.role === 'admin') isAdmin = true;
      } catch (e) {}
    }
        if (isAdmin) {
            products = await Product.find(query).populate('seller', 'username');
        } else {
            products = await Product.find(query);
        }
        
        const mapped = products.map(p => {
            let status = 'pending';
            if (p.approved) status = 'approved';
            else if (p.rejected) status = 'rejected';
            return {
                ...p.toObject(),
                status,
                reason: p.rejectionReason || ''
            };
        });
        console.log(`📦 Found ${products.length} products`);
        res.json(mapped);
  } catch (err) {
    console.error('❌ Error fetching products:', err);
    res.status(500).json({ message: err.message });
  }
});


// Get product by ID
router.get('/:id', async (req, res) => {
  console.log(`🔍 GET /api/products/${req.params.id} hit`);
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      console.log('⚠️ Product not found');
      return res.status(404).json({ message: "Product not found" });
    }
    console.log('✅ Product found:', product.name);
    res.json(product);
  } catch (err) {
    console.error('❌ Error fetching product by ID:', err);
    res.status(500).json({ message: err.message });
  }
});



router.post('/', authMiddleware, (req, res, next) => {
  upload.single('imageFile')(req, res, (err) => {
    if (err) {
      console.error('❌ Multer upload error:', err.message);
      return res.status(400).json({ message: 'File upload error: ' + err.message });
    }
    next();
  });
}, async (req, res) => {
  console.log('📝 POST /api/products hit');
  console.log('🛒 Request Body:', req.body);
  console.log('📁 File info:', req.file ? { fieldname: req.file.fieldname, path: req.file.path, size: req.file.size } : 'No file');
  
  let imageUrl = '';
  if (req.file && req.file.path) {
    imageUrl = req.file.path; // Cloudinary URL
    console.log('✅ Image URL set:', imageUrl);
  }
  
  const product = new Product({
    name: req.body.name,
    category: req.body.category,
    price: req.body.price,
    image: imageUrl,
    description: req.body.description,
    stock: req.body.stock,
    approved: false, 
    seller: req.user.id, 
  });

  try {
    console.log('💾 Saving product:', product);
    const newProduct = await product.save();
    console.log('✅ Product saved successfully:', newProduct._id);
    res.status(201).json({ message: '✅ Awaiting admin approval', product: newProduct });
  } catch (err) {
    console.error('❌ Product save error:', err.message);
    console.error('❌ Full error:', err);
    res.status(400).json({ message: 'Validation error: ' + err.message });
  }
});


router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    
    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }
    
    await product.deleteOne();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete product' });
  }
});

module.exports = router;
