const db = require('../src/config/db');

(async () => {
  try {
    const result = await db.query('SELECT 1 AS result');
    console.log('PostgreSQL connection verified:', result.rows[0]);
  } catch (error) {
    console.error('PostgreSQL connection failed:', error.message);
    process.exit(1);
  } finally {
    await db.pool.end();
  }
})();
