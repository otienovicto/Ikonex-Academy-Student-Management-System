// Generate Admin Script - Create admin user
require('dotenv').config();
const jwt = require('jsonwebtoken');

async function generateAdminToken() {
  try {
    const adminData = {
      id: 1,
      username: 'admin',
      email: 'admin@example.com',
      role: 'admin',
    };

    const token = jwt.sign(adminData, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    console.log('Admin Token Generated:');
    console.log(token);
    console.log('\nAdmin Credentials:');
    console.log('Username: admin');
    console.log('Email: admin@example.com');
    console.log('Token: ', token);
  } catch (error) {
    console.error('Error generating admin token:', error);
  }
}

generateAdminToken();
