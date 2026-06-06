// Student Module Integration Tests
const request = require('supertest');
const app = require('../src/app');

describe('Student Module API Tests', () => {
  let studentId;
  const validStudentData = {
    registrationNumber: 'TST001',
    firstName: 'Test',
    lastName: 'Student',
    email: 'test.student@example.com',
    dateOfBirth: '2008-05-15',
    streamId: 1, // Assumes stream with ID 1 exists
  };

  describe('POST /api/students - Register Student', () => {
    it('should register a new student with valid data', async () => {
      const res = await request(app)
        .post('/api/students')
        .send(validStudentData);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('registered successfully');
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.registrationNumber).toBe(validStudentData.registrationNumber);
      expect(res.body.data.stream).toHaveProperty('id');
      studentId = res.body.data.id;
    });

    it('should fail without registration number', async () => {
      const data = { ...validStudentData };
      delete data.registrationNumber;

      const res = await request(app)
        .post('/api/students')
        .send(data);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should fail with invalid email', async () => {
      const data = { ...validStudentData, email: 'invalid-email' };

      const res = await request(app)
        .post('/api/students')
        .send(data);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should fail with short registration number', async () => {
      const data = { ...validStudentData, registrationNumber: 'ST' };

      const res = await request(app)
        .post('/api/students')
        .send(data);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/students - Get All Students', () => {
    it('should retrieve all students', async () => {
      const res = await request(app)
        .get('/api/students');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('GET /api/students/:id - Get Student by ID', () => {
    it('should retrieve a specific student', async () => {
      const res = await request(app)
        .get(`/api/students/${studentId}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(studentId);
      expect(res.body.data).toHaveProperty('stream');
      expect(res.body.data).toHaveProperty('scores');
    });

    it('should return 404 for non-existent student', async () => {
      const res = await request(app)
        .get('/api/students/99999');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('not found');
    });
  });

  describe('GET /api/students/stream/:streamId - Get Students by Stream', () => {
    it('should retrieve students from a specific stream', async () => {
      const res = await request(app)
        .get('/api/students/stream/1');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);

      if (res.body.data.length > 0) {
        res.body.data.forEach((student) => {
          expect(student.stream.id).toBe(1);
        });
      }
    });

    it('should return empty array for stream with no students', async () => {
      const res = await request(app)
        .get('/api/students/stream/999');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('PUT /api/students/:id - Update Student', () => {
    it('should update student with valid data', async () => {
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
      };

      const res = await request(app)
        .put(`/api/students/${studentId}`)
        .send(updateData);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.firstName).toBe('Updated');
      expect(res.body.data.lastName).toBe('Name');
    });

    it('should reassign student to different stream', async () => {
      const updateData = { streamId: 2 };

      const res = await request(app)
        .put(`/api/students/${studentId}`)
        .send(updateData);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.stream.id).toBe(2);
    });

    it('should fail with no update fields', async () => {
      const res = await request(app)
        .put(`/api/students/${studentId}`)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should fail with invalid email format', async () => {
      const res = await request(app)
        .put(`/api/students/${studentId}`)
        .send({ email: 'invalid-email' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/students/:id - Delete Student', () => {
    it('should delete a student successfully', async () => {
      const res = await request(app)
        .delete(`/api/students/${studentId}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('deleted successfully');
    });

    it('should confirm student is deleted', async () => {
      const res = await request(app)
        .get(`/api/students/${studentId}`);

      expect(res.status).toBe(404);
    });
  });
});

/**
 * Test Execution:
 * Ensure PostgreSQL is running with schema initialized
 * Ensure at least 2 streams exist (ID 1 and 2)
 * Run tests: npm test -- student.test.js
 */
