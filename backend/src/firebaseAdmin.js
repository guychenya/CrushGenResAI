const admin = require('firebase-admin');

// Initialize Firebase Admin with default credentials for development
// In production, use proper service account credentials
try {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault()
    });
  }
  console.log('Firebase Admin initialized successfully');
  module.exports = admin;
} catch (error) {
  console.warn('Firebase Admin initialization failed, using mock:', error.message);
  // Export a mock admin object for development when Firebase isn't available
  module.exports = {
    auth: () => ({
      getUser: () => Promise.reject(new Error('Firebase not configured')),
      verifyIdToken: () => Promise.reject(new Error('Firebase not configured'))
    })
  };
}
