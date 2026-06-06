// Assessment & Scoring Integration Tests
const request = require('supertest');
const db = require('../../config/db');
const ScoreService = require('../assessments/score.service');

// Mock server setup
const express = require('express');
const scoreRoutes = require('../assessments/score.routes');
const errorMiddleware = require('../../middlewares/error.middleware');

const app = express();
app.use(express.json());
app.use('/api/scores', scoreRoutes);
app.use(errorMiddleware);

describe('Assessment & Scoring Module', () => {
  let studentId = null;
  let subjectId = null;
  let scoreId = null;
  let streamId = null;

  beforeAll(async () => {
    // Setup: Create test stream, student, and subject
    const streamResult = await db.query(
      `INSERT INTO class_streams (name, code, description, created_at, updated_at)
       VALUES ($1, $2, $3, now(), now())
       RETURNING id`,
      ['Test Stream', 'TEST-STREAM', 'Stream for scoring tests']
    );
    streamId = streamResult.rows[0].id;

    const studentResult = await db.query(
      `INSERT INTO students (registration_number, first_name, last_name, email, date_of_birth, stream_id, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, now(), now())
       RETURNING id`,
      ['TESTSTU001', 'Test', 'Student', 'test.student@example.com', '2005-01-01', streamId]
    );
    studentId = studentResult.rows[0].id;

    const subjectResult = await db.query(
      `INSERT INTO subjects (name, code, created_at, updated_at)
       VALUES ($1, $2, now(), now())
       RETURNING id`,
      ['Test Subject', 'TESTSUBJ001']
    );
    subjectId = subjectResult.rows[0].id;
  });

  afterAll(async () => {
    // Cleanup: Remove test data
    await db.query('DELETE FROM assessments WHERE student_id = $1', [studentId]);
    await db.query('DELETE FROM students WHERE id = $1', [studentId]);
    await db.query('DELETE FROM subjects WHERE id = $1', [subjectId]);
    await db.query('DELETE FROM class_streams WHERE id = $1', [streamId]);
  });

  describe('Score CRUD Operations', () => {
    describe('POST /api/scores - Create Score', () => {
      test('should create score with valid data', async () => {
        const response = await request(app).post('/api/scores').send({
          studentId,
          subjectId,
          marks: 85,
          assessmentType: 'exam',
        });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toContain('created');
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data.marks).toBe(85);
        expect(response.body.data.assessmentType).toBe('exam');
        expect(response.body.data.student.id).toBe(studentId);
        expect(response.body.data.subject.id).toBe(subjectId);
        expect(response.body.error).toBeNull();

        scoreId = response.body.data.id;
      });

      test('should create score with decimal marks', async () => {
        // Create another student and subject for this test
        const student2Result = await db.query(
          `INSERT INTO students (registration_number, first_name, last_name, email, date_of_birth, stream_id, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, now(), now())
           RETURNING id`,
          ['TESTSTU002', 'Test2', 'Student2', 'test.student2@example.com', '2005-01-02', streamId]
        );
        const student2Id = student2Result.rows[0].id;

        const subject2Result = await db.query(
          `INSERT INTO subjects (name, code, created_at, updated_at)
           VALUES ($1, $2, now(), now())
           RETURNING id`,
          ['Test Subject 2', 'TESTSUBJ002']
        );
        const subject2Id = subject2Result.rows[0].id;

        const response = await request(app).post('/api/scores').send({
          studentId: student2Id,
          subjectId: subject2Id,
          marks: 92.5,
          assessmentType: 'test',
        });

        expect(response.status).toBe(201);
        expect(response.body.data.marks).toBe(92.5);

        // Cleanup
        await db.query('DELETE FROM assessments WHERE student_id = $1', [student2Id]);
        await db.query('DELETE FROM students WHERE id = $1', [student2Id]);
        await db.query('DELETE FROM subjects WHERE id = $1', [subject2Id]);
      });

      test('should reject score with marks > 100', async () => {
        const response = await request(app).post('/api/scores').send({
          studentId,
          subjectId: subjectId + 1, // Different subject to avoid duplicate
          marks: 105,
          assessmentType: 'test',
        });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
      });

      test('should reject score with marks < 0', async () => {
        const response = await request(app).post('/api/scores').send({
          studentId,
          subjectId: subjectId + 1,
          marks: -5,
          assessmentType: 'test',
        });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
      });

      test('should reject score with invalid assessment type', async () => {
        const response = await request(app).post('/api/scores').send({
          studentId,
          subjectId: subjectId + 1,
          marks: 85,
          assessmentType: 'invalid',
        });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
      });

      test('should reject score with missing marks', async () => {
        const response = await request(app).post('/api/scores').send({
          studentId,
          subjectId: subjectId + 1,
          assessmentType: 'test',
        });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
      });

      test('should reject score with missing assessment type', async () => {
        const response = await request(app).post('/api/scores').send({
          studentId,
          subjectId: subjectId + 1,
          marks: 85,
        });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
      });

      test('should reject score with unknown fields', async () => {
        const response = await request(app).post('/api/scores').send({
          studentId,
          subjectId: subjectId + 1,
          marks: 85,
          assessmentType: 'test',
          extraField: 'should fail',
        });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
      });

      test('should prevent duplicate score for same student+subject', async () => {
        // Try to create another score for the same student+subject
        const response = await request(app).post('/api/scores').send({
          studentId,
          subjectId,
          marks: 90,
          assessmentType: 'test',
        });

        expect(response.status).toBe(409);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('already exists');
      });
    });

    describe('GET /api/scores - Get All Scores', () => {
      test('should get all scores', async () => {
        const response = await request(app).get('/api/scores');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.error).toBeNull();
      });

      test('should return scores with all required fields', async () => {
        const response = await request(app).get('/api/scores');

        expect(response.status).toBe(200);
        if (response.body.data.length > 0) {
          const score = response.body.data[0];
          expect(score).toHaveProperty('id');
          expect(score).toHaveProperty('marks');
          expect(score).toHaveProperty('assessmentType');
          expect(score).toHaveProperty('student');
          expect(score).toHaveProperty('subject');
          expect(score).toHaveProperty('createdAt');
          expect(score).toHaveProperty('updatedAt');
        }
      });
    });

    describe('GET /api/scores/:id - Get Score by ID', () => {
      test('should get score by valid ID', async () => {
        const response = await request(app).get(`/api/scores/${scoreId}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(scoreId);
        expect(response.body.data.marks).toBe(85);
        expect(response.body.error).toBeNull();
      });

      test('should return 404 for non-existent score ID', async () => {
        const response = await request(app).get('/api/scores/99999');

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
      });
    });

    describe('PUT /api/scores/:id - Update Score', () => {
      test('should update score marks', async () => {
        const response = await request(app).put(`/api/scores/${scoreId}`).send({
          marks: 88,
        });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.marks).toBe(88);
        expect(response.body.message).toContain('updated');
      });

      test('should update assessment type', async () => {
        const response = await request(app).put(`/api/scores/${scoreId}`).send({
          assessmentType: 'assignment',
        });

        expect(response.status).toBe(200);
        expect(response.body.data.assessmentType).toBe('assignment');
      });

      test('should reject update with empty request', async () => {
        const response = await request(app).put(`/api/scores/${scoreId}`).send({});

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
      });

      test('should reject update with invalid marks', async () => {
        const response = await request(app).put(`/api/scores/${scoreId}`).send({
          marks: 105,
        });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
      });

      test('should reject update with invalid type', async () => {
        const response = await request(app).put(`/api/scores/${scoreId}`).send({
          assessmentType: 'invalid',
        });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
      });
    });

    describe('DELETE /api/scores/:id - Delete Score', () => {
      test('should delete score', async () => {
        // Create a score to delete
        const student3Result = await db.query(
          `INSERT INTO students (registration_number, first_name, last_name, email, date_of_birth, stream_id, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, now(), now())
           RETURNING id`,
          ['TESTSTU003', 'Test3', 'Student3', 'test.student3@example.com', '2005-01-03', streamId]
        );
        const student3Id = student3Result.rows[0].id;

        const subject3Result = await db.query(
          `INSERT INTO subjects (name, code, created_at, updated_at)
           VALUES ($1, $2, now(), now())
           RETURNING id`,
          ['Test Subject 3', 'TESTSUBJ003']
        );
        const subject3Id = subject3Result.rows[0].id;

        const createResponse = await request(app).post('/api/scores').send({
          studentId: student3Id,
          subjectId: subject3Id,
          marks: 75,
          assessmentType: 'test',
        });

        const deleteId = createResponse.body.data.id;

        // Delete it
        const response = await request(app).delete(`/api/scores/${deleteId}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toContain('deleted');

        // Verify it's gone
        const getResponse = await request(app).get(`/api/scores/${deleteId}`);
        expect(getResponse.status).toBe(404);

        // Cleanup
        await db.query('DELETE FROM students WHERE id = $1', [student3Id]);
        await db.query('DELETE FROM subjects WHERE id = $1', [subject3Id]);
      });
    });
  });

  describe('Performance Queries', () => {
    let student4Id = null;
    let student5Id = null;
    let subject4Id = null;
    let subject5Id = null;

    beforeAll(async () => {
      // Create additional test data for performance queries
      const s4Result = await db.query(
        `INSERT INTO students (registration_number, first_name, last_name, email, date_of_birth, stream_id, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, now(), now())
         RETURNING id`,
        ['TESTSTU004', 'Test4', 'Student4', 'test.student4@example.com', '2005-01-04', streamId]
      );
      student4Id = s4Result.rows[0].id;

      const s5Result = await db.query(
        `INSERT INTO students (registration_number, first_name, last_name, email, date_of_birth, stream_id, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, now(), now())
         RETURNING id`,
        ['TESTSTU005', 'Test5', 'Student5', 'test.student5@example.com', '2005-01-05', streamId]
      );
      student5Id = s5Result.rows[0].id;

      const sub4Result = await db.query(
        `INSERT INTO subjects (name, code, created_at, updated_at)
         VALUES ($1, $2, now(), now())
         RETURNING id`,
        ['Test Subject 4', 'TESTSUBJ004']
      );
      subject4Id = sub4Result.rows[0].id;

      const sub5Result = await db.query(
        `INSERT INTO subjects (name, code, created_at, updated_at)
         VALUES ($1, $2, now(), now())
         RETURNING id`,
        ['Test Subject 5', 'TESTSUBJ005']
      );
      subject5Id = sub5Result.rows[0].id;

      // Create multiple scores for testing aggregation
      await request(app).post('/api/scores').send({
        studentId: student4Id,
        subjectId: subject4Id,
        marks: 80,
        assessmentType: 'test',
      });

      await request(app).post('/api/scores').send({
        studentId: student4Id,
        subjectId: subject5Id,
        marks: 90,
        assessmentType: 'exam',
      });

      await request(app).post('/api/scores').send({
        studentId: student5Id,
        subjectId: subject4Id,
        marks: 85,
        assessmentType: 'assignment',
      });

      await request(app).post('/api/scores').send({
        studentId: student5Id,
        subjectId: subject5Id,
        marks: 95,
        assessmentType: 'exam',
      });
    });

    afterAll(async () => {
      // Cleanup
      await db.query('DELETE FROM assessments WHERE student_id IN ($1, $2)', [student4Id, student5Id]);
      await db.query('DELETE FROM students WHERE id IN ($1, $2)', [student4Id, student5Id]);
      await db.query('DELETE FROM subjects WHERE id IN ($1, $2)', [subject4Id, subject5Id]);
    });

    describe('GET /api/scores/student/:studentId - Student Performance', () => {
      test('should get student performance', async () => {
        const response = await request(app).get(`/api/scores/student/${student4Id}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.student.id).toBe(student4Id);
        expect(Array.isArray(response.body.data.scores)).toBe(true);
        expect(response.body.data.scores.length).toBe(2);
      });

      test('should return 404 for student with no scores', async () => {
        const response = await request(app).get(`/api/scores/student/99999`);

        expect(response.status).toBe(404);
      });
    });

    describe('GET /api/scores/subject/:subjectId - Subject Performance', () => {
      test('should get subject performance', async () => {
        const response = await request(app).get(`/api/scores/subject/${subject4Id}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.subject.id).toBe(subject4Id);
        expect(Array.isArray(response.body.data.scores)).toBe(true);
        expect(response.body.data.scores.length).toBe(2);
      });

      test('should return 404 for subject with no scores', async () => {
        const response = await request(app).get(`/api/scores/subject/99999`);

        expect(response.status).toBe(404);
      });
    });

    describe('GET /api/scores/student/:studentId/aggregates - Student Aggregates', () => {
      test('should get student aggregates with correct GROUP BY statistics', async () => {
        const response = await request(app).get(`/api/scores/student/${student4Id}/aggregates`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.statistics).toHaveProperty('totalAssessments');
        expect(response.body.data.statistics).toHaveProperty('averageMarks');
        expect(response.body.data.statistics).toHaveProperty('minMarks');
        expect(response.body.data.statistics).toHaveProperty('maxMarks');
        expect(response.body.data.statistics).toHaveProperty('subjectsTaken');

        // Student 4 has marks: 80, 90
        expect(response.body.data.statistics.totalAssessments).toBe(2);
        expect(parseFloat(response.body.data.statistics.averageMarks)).toBe(85);
        expect(parseFloat(response.body.data.statistics.minMarks)).toBe(80);
        expect(parseFloat(response.body.data.statistics.maxMarks)).toBe(90);
        expect(response.body.data.statistics.subjectsTaken.length).toBe(2);
      });

      test('should return 404 for non-existent student', async () => {
        const response = await request(app).get(`/api/scores/student/99999/aggregates`);

        expect(response.status).toBe(404);
      });
    });

    describe('GET /api/scores/subject/:subjectId/aggregates - Subject Aggregates', () => {
      test('should get subject aggregates with class statistics', async () => {
        const response = await request(app).get(`/api/scores/subject/${subject4Id}/aggregates`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.statistics).toHaveProperty('totalScores');
        expect(response.body.data.statistics).toHaveProperty('classAverage');
        expect(response.body.data.statistics).toHaveProperty('minMarks');
        expect(response.body.data.statistics).toHaveProperty('maxMarks');
        expect(response.body.data.statistics).toHaveProperty('medianMarks');
        expect(response.body.data.statistics).toHaveProperty('studentsAssessed');

        // Subject 4 has marks: 80, 85
        expect(response.body.data.statistics.totalScores).toBe(2);
        expect(parseFloat(response.body.data.statistics.classAverage)).toBe(82.5);
        expect(parseFloat(response.body.data.statistics.minMarks)).toBe(80);
        expect(parseFloat(response.body.data.statistics.maxMarks)).toBe(85);
        expect(response.body.data.statistics.studentsAssessed).toBe(2);
      });

      test('should return 404 for non-existent subject', async () => {
        const response = await request(app).get(`/api/scores/subject/99999/aggregates`);

        expect(response.status).toBe(404);
      });
    });

    describe('GET /api/scores/student/:studentId/subject/:subjectId - Specific Performance', () => {
      test('should get student-subject performance', async () => {
        const response = await request(app).get(
          `/api/scores/student/${student4Id}/subject/${subject4Id}`
        );

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.marks).toBe(80);
        expect(response.body.data.student.id).toBe(student4Id);
        expect(response.body.data.subject.id).toBe(subject4Id);
      });

      test('should return 404 for non-existent score', async () => {
        const response = await request(app).get(`/api/scores/student/${student4Id}/subject/99999`);

        expect(response.status).toBe(404);
      });
    });
  });

  describe('Response Format Validation', () => {
    test('success response should follow standard format', async () => {
      const response = await request(app).get('/api/scores');

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('error', null);
    });

    test('error response should follow standard format', async () => {
      const response = await request(app).post('/api/scores').send({
        studentId,
        subjectId,
        marks: 105,
        assessmentType: 'test',
      });

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('data', null);
      expect(response.body).toHaveProperty('error');
    });
  });
});
