const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: false,
    index: true 
  },
  products: [
    {
      productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: [true, 'Product ID is required'] 
      },
      quantity: { 
        type: Number, 
        required: [true, 'Quantity is required'],
        min: [1, 'Quantity must be at least 1'],
        validate: {
          validator: Number.isInteger,
          message: 'Quantity must be a whole number'
        }
      }
    }
  ],
  customerName: { 
    type: String, 
    required: [true, 'Customer name is required'], 
    trim: true,
    minlength: [2, 'Name must be at least 2 characters']
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    trim: true, 
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'],
    index: true
  },
  phone: { 
    type: String, 
    required: [true, 'Phone number is required'], 
    trim: true,
    match: [/^[+\d\-\s()]{7,20}$/, 'Please enter a valid phone number']
  },
  address: { 
    type: String, 
    required: [true, 'Delivery address is required'], 
    trim: true,
    minlength: [5, 'Address must be at least 5 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
    index: true
  },
  total: {
    type: Number,
    default: 0,
    min: [0, 'Total cannot be negative']
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Pre-save middleware to validate products and calculate total
orderSchema.pre('save', async function(next) {
  try {
    if (this.isModified('products')) {
      // Verify all products exist and have sufficient stock
      const productIds = this.products.map(p => p.productId);
      const products = await mongoose.model('Product').find({
        _id: { $in: productIds }
      }).select('price stock approved rejected');

      const stockMap = new Map(products.map(p => [p._id.toString(), { stock: p.stock, price: p.price, approved: p.approved, rejected: p.rejected }]));
      
      let orderTotal = 0;
      for (const orderProduct of this.products) {
        const product = stockMap.get(orderProduct.productId.toString());
        if (!product) {
          throw new Error(`Product ${orderProduct.productId} not found`);
        }
        if (!product.approved || product.rejected) {
          throw new Error(`Product ${orderProduct.productId} is not approved for sale`);
        }
        if (product.stock < orderProduct.quantity) {
          throw new Error(`Insufficient stock for product ${orderProduct.productId}`);
        }
        orderTotal += product.price * orderProduct.quantity;
      }
      this.total = orderTotal;
    }
    next();
  } catch (err) {
    next(err);
  }
});

// Post-save middleware to update product stock
orderSchema.post('save', async function() {
  if (this.status === 'pending') {
    try {
      for (const orderProduct of this.products) {
        await mongoose.model('Product').updateOne(
          { _id: orderProduct.productId },
          { $inc: { stock: -orderProduct.quantity } }
        );
      }
    } catch (err) {
      console.error('Error updating product stock:', err);
    }
  }
});

module.exports = mongoose.model('Order', orderSchema);
