// Production Configuration
module.exports = {
  cors: {
    origin: process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',')
      : ['http://localhost:3000', 'http://localhost:5000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
  },
  
  database: {
    maxPoolSize: 50,
    minPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000
  },

  security: {
    bcryptRounds: 10,
    jwtExpires: '7d',
    requestTimeout: 30000
  },

  features: {
    imageUpload: true,
    emailNotifications: false,
    analyticsEnabled: true
  }
};
