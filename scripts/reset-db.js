// Reset Database Script - Clear all data and recreate schema
require('dotenv').config();
const prisma = require('../backend/src/config/db');

async function resetDatabase() {
  try {
    console.log('Starting database reset...');

    // Delete all data (respecting foreign keys)
    await prisma.score.deleteMany();
    await prisma.student.deleteMany();
    await prisma.subject.deleteMany();
    await prisma.stream.deleteMany();

    console.log('Database reset successfully!');
  } catch (error) {
    console.error('Error resetting database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetDatabase();
