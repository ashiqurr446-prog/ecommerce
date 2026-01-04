// server/models/Product.js 
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Product name is required'],
    trim: true
  },
  category: { 
    type: String, 
    required: [true, 'Category is required'],
    trim: true
  },
  price: { 
    type: Number, 
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  image: String,
  description: { 
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  stock: { 
    type: Number, 
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative']
  },
  approved: {
    type: Boolean,
    default: false,
    index: true
  },
  rejected: { 
    type: Boolean, 
    default: false,
    index: true 
  },
  rejectionReason: { 
    type: String, 
    default: '',
    trim: true 
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  reviews: [
    {
      user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
      },
      username: { 
        type: String,
        required: true 
      },
      comment: { 
        type: String,
        trim: true 
      },
      rating: { 
        type: Number, 
        required: true,
        min: 1, 
        max: 5 
      },
      

      
      createdAt: { 
        type: Date, 
        default: Date.now,
        index: true
      }
    }
  ],
  history: [
    {
      action: {
        type: String,
        enum: ['created', 'price_changed', 'stock_changed', 'approved', 'rejected', 'info_updated'],
        required: true
      },
      changedByName: String,
      changes: {
        field: String,
        oldValue: mongoose.Schema.Types.Mixed,
        newValue: mongoose.Schema.Types.Mixed
      },
      timestamp: {
        type: Date,
        default: Date.now,
        index: true
      }
    }
  ]
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Add indexes for frequent queries
productSchema.index({ name: 'text', description: 'text' }); // For search
productSchema.index({ category: 1 }); // For category filtering
productSchema.index({ 'reviews.rating': 1 }); // For sorting by rating
productSchema.index({ createdAt: -1 }); // For recent products

// Virtual for average rating
productSchema.virtual('averageRating').get(function() {
  if (!this.reviews.length) return 0;
  return this.reviews.reduce((acc, rev) => acc + rev.rating, 0) / this.reviews.length;
});

// Pre-save middleware for validation
productSchema.pre('save', function(next) {
  if (this.price < 0) {
    next(new Error('Price cannot be negative'));
  }
  if (this.stock < 0) {
    next(new Error('Stock cannot be negative'));
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
