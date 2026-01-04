// config.js - Centralized API configuration
// Automatically detect environment: localhost for development, production URL for deployed

const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000'
  : `${window.location.protocol}//${window.location.hostname}:${window.location.port || ''}`.replace(':$', '');

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { API_BASE };
}
