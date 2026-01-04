// config.js - Centralized API configuration
// Change this to switch between localhost and production

// For local development:
const API_BASE = 'http://localhost:5000';

// For production (Render.com):
// const API_BASE = 'https://ecommerce-server-cq95.onrender.com';

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { API_BASE };
}
