const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  testConnection: async () => {
    try {
      await pool.query('SELECT 1');
      console.log('Database connection successful');
    } catch (error) {
      console.error('Database connection failed', error);
    }
  }
};
