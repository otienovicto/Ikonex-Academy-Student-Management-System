// Database initialization script for PostgreSQL 18 on port 5433
require('dotenv').config();
const { Pool, Client } = require('pg');
const fs = require('fs');
const path = require('path');

const DB_NAME = 'student_management';
const DB_USER = 'postgres';
const DB_PASSWORD = 'Loch@2026';
const DB_HOST = 'localhost';
const DB_PORT = 5433;

console.log('=== Database Initialization Script ===');
console.log(`Target: ${DB_USER}@${DB_HOST}:${DB_PORT}/${DB_NAME}`);

// Step 1: Connect to PostgreSQL server to create database
async function initializeDatabase() {
  // First, connect to the default 'postgres' database to create our database
  const adminClient = new Client({
    user: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: DB_PORT,
    database: 'postgres',
  });

  try {
    console.log('\n1. Connecting to PostgreSQL server...');
    await adminClient.connect();
    console.log('   ✓ Connected');

    // Check if database exists
    console.log(`\n2. Checking if database "${DB_NAME}" exists...`);
    const result = await adminClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [DB_NAME]
    );

    if (result.rows.length === 0) {
      console.log(`   Database does not exist. Creating...`);
      await adminClient.query(`CREATE DATABASE "${DB_NAME}"`);
      console.log(`   ✓ Database created`);
    } else {
      console.log(`   ✓ Database already exists`);
    }

    await adminClient.end();

    // Step 2: Connect to the new database and run schema
    console.log('\n3. Connecting to the new database...');
    const pool = new Pool({
      user: DB_USER,
      password: DB_PASSWORD,
      host: DB_HOST,
      port: DB_PORT,
      database: DB_NAME,
    });

    console.log('   ✓ Connected');

    // Run the schema
    console.log('\n4. Running schema...');
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    await pool.query(schema);
    console.log('   ✓ Schema applied');

    // Check tables
    console.log('\n5. Verifying tables...');
    const tables = await pool.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' ORDER BY table_name
    `);

    if (tables.rows.length > 0) {
      console.log('   ✓ Tables created:');
      tables.rows.forEach(t => console.log(`     - ${t.table_name}`));
    } else {
      console.log('   ✗ No tables found!');
      process.exit(1);
    }

    // Test connection
    console.log('\n6. Testing database connection...');
    const testResult = await pool.query('SELECT 1 AS result');
    console.log('   ✓ Database is ready');

    await pool.end();

    console.log('\n=== Database initialization complete! ===');
    console.log(`\nYour backend should now use:`);
    console.log(`  DATABASE_URL=postgresql://postgres:Loch%402026@localhost:5433/student_management`);
    console.log(`  set PORT=5000`);
    console.log(`  npm run dev`);

    process.exit(0);
  } catch (error) {
    console.error('\n✗ Error:', error.message);
    console.error('Code:', error.code);
    process.exit(1);
  }
}

initializeDatabase();
