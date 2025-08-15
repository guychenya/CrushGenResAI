const { Pool } = require('pg');
require('dotenv').config();

// Use a more robust database configuration
const dbConfig = {
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/crushgenresai',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};

const pool = new Pool(dbConfig);

module.exports = {
  query: async (text, params) => {
    try {
      return await pool.query(text, params);
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  },
  testConnection: async () => {
    try {
      await pool.query('SELECT 1');
      console.log('Database connection successful');
      return true;
    } catch (error) {
      console.warn('Database connection failed (continuing in mock mode):', error.message);
      return false;
    }
  }
};
