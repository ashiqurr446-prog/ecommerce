// File: server/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: [true, 'Username is required'],
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [50, 'Username cannot exceed 50 characters']
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'],
    index: true
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    enum: {
      values: ['admin', 'seller', 'buyer'],
      message: '{VALUE} is not a valid role'
    },
    default: 'buyer',
    index: true
  },
  status: {
    type: String,
    enum: {
      values: ['active', 'blocked'],
      message: '{VALUE} is not a valid status'
    },
    default: 'active',
    index: true
  },
  shopName: {
    type: String,
    default: '',
    trim: true,
    validate: {
      validator: function(v) {
        return this.role !== 'seller' || (v && v.length >= 3);
      },
      message: 'Shop name is required for sellers and must be at least 3 characters'
    }
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add instance method to safely return user data without password
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

// Pre-save middleware
userSchema.pre('save', async function(next) {
  if (this.isModified('email')) {
    const existingUser = await this.constructor.findOne({ email: this.email, _id: { $ne: this._id } });
    if (existingUser) {
      next(new Error('Email already in use'));
    }
  }
  if (this.isModified('role') && this.role === 'seller' && !this.shopName) {
    next(new Error('Shop name is required for sellers'));
  }
  next();
});

// Static method to find active users
userSchema.statics.findActive = function() {
  return this.find({ status: 'active' });
};

module.exports = mongoose.model('User', userSchema);
