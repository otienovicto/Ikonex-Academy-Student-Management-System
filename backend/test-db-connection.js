// Simple database connection test with verbose logging
require('dotenv').config();
const { Pool } = require('pg');

console.log('=== Database Connection Test ===');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
console.log('DB_USER:', process.env.DB_USER || 'NOT SET');
console.log('DB_HOST:', process.env.DB_HOST || 'localhost');
console.log('DB_PORT:', process.env.DB_PORT || '5432');
console.log('DB_NAME:', process.env.DB_NAME || 'student_management');

const connectionString = process.env.DATABASE_URL ||
  `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || 'password'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'student_management'}`;

console.log('Connection string (masked):', connectionString.replace(/:[^@]*@/, ':****@'));
console.log('Attempting connection with 10 second timeout...');

const pool = new Pool({
  connectionString,
  ssl: false,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 10000,
});

const startTime = Date.now();

pool.query('SELECT 1 AS result')
  .then((result) => {
    const elapsed = Date.now() - startTime;
    console.log(`✓ PostgreSQL connection verified in ${elapsed}ms`);
    console.log('Result:', result.rows[0]);
    process.exit(0);
  })
  .catch((error) => {
    const elapsed = Date.now() - startTime;
    console.error(`✗ PostgreSQL connection failed after ${elapsed}ms`);
    console.error('Error:', error.message);
    console.error('Code:', error.code);
    process.exit(1);
  })
  .finally(() => {
    pool.end();
  });
