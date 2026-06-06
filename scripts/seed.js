// Seed Script - Populate database with initial data
require('dotenv').config();
const prisma = require('../src/config/db');

async function seedDatabase() {
  try {
    console.log('Starting database seed...');

    // Create Streams
    const stream1 = await prisma.stream.create({
      data: {
        name: 'Class 10A',
        code: 'SCICEA',
        description: 'Science Stream - Class 10A',
      },
    });

    const stream2 = await prisma.stream.create({
      data: {
        name: 'Class 10B',
        code: 'COMMB',
        description: 'Commerce Stream - Class 10B',
      },
    });

    // Create Subjects
    await prisma.subject.createMany({
      data: [
        { name: 'Mathematics', code: 'MATH101', streamId: stream1.id },
        { name: 'Physics', code: 'PHYS101', streamId: stream1.id },
        { name: 'Chemistry', code: 'CHEM101', streamId: stream1.id },
        { name: 'English', code: 'ENG101', streamId: stream2.id },
        { name: 'Economics', code: 'ECON101', streamId: stream2.id },
        { name: 'Accounting', code: 'ACC101', streamId: stream2.id },
      ],
    });

    // Create Students
    await prisma.student.createMany({
      data: [
        {
          registrationNumber: 'STU001',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          dateOfBirth: new Date('2008-05-15'),
          streamId: stream1.id,
        },
        {
          registrationNumber: 'STU002',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
          dateOfBirth: new Date('2008-07-22'),
          streamId: stream1.id,
        },
      ],
    });

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
