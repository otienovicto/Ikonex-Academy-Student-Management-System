// Subject Integration Tests
const request = require('supertest');
const db = require('../../config/db');
const SubjectService = require('../subjects/subject.service');

// Mock server setup
const express = require('express');
const subjectRoutes = require('../subjects/subject.routes');
const errorMiddleware = require('../../middlewares/error.middleware');

const app = express();
app.use(express.json());
app.use('/api/subjects', subjectRoutes);
app.use(errorMiddleware);

describe('Subject Module', () => {
  let subjectId = null;
  let streamId = null;

  beforeAll(async () => {
    // Setup: Create test stream for relationships
    const streamResult = await db.query(
      `INSERT INTO class_streams (name, code, description, created_at, updated_at)
       VALUES ($1, $2, $3, now(), now())
       RETURNING id`,
      ['Test Stream', 'TEST-STREAM', 'Stream for subject tests']
    );
    streamId = streamResult.rows[0].id;
  });

  afterAll(async () => {
    // Cleanup: Remove test data
    await db.query('DELETE FROM stream_subjects WHERE stream_id = $1', [streamId]);
    await db.query('DELETE FROM class_streams WHERE id = $1', [streamId]);
    await db.query('DELETE FROM subjects WHERE code LIKE $1', ['TEST%']);
  });

  describe('Subject CRUD Operations', () => {
    describe('POST /api/subjects - Create Subject', () => {
      test('should create subject with valid data', async () => {
        const response = await request(app).post('/api/subjects').send({
          name: 'TestMath',
          code: 'TESTMATH001',
        });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toContain('created');
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data.name).toBe('TestMath');
        expect(response.body.data.code).toBe('TESTMATH001');
        expect(response.body.data.streams).toEqual([]);
        expect(response.body.data.scores).toEqual([]);
        expect(response.body.error).toBeNull();

        subjectId = response.body.data.id;
      });

      test('should reject subject with name too short', async () => {
        const response = await request(app).post('/api/subjects').send({
          name: 'M',
          code: 'TESTMATH002',
        });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.error).toBeDefined();
      });

      test('should reject subject with name too long', async () => {
        const response = await request(app).post('/api/subjects').send({
          name: 'A'.repeat(101),
          code: 'TESTMATH003',
        });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
      });

      test('should reject subject with code too short', async () => {
        const response = await request(app).post('/api/subjects').send({
          name: 'TestSubject',
          code: 'T',
        });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
      });

      test('should reject subject with code too long', async () => {
        const response = await request(app).post('/api/subjects').send({
          name: 'TestSubject',
          code: 'A'.repeat(21),
        });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
      });

      test('should reject subject with missing name', async () => {
        const response = await request(app).post('/api/subjects').send({
          code: 'TESTMATH004',
        });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
      });

      test('should reject subject with missing code', async () => {
        const response = await request(app).post('/api/subjects').send({
          name: 'TestSubject',
        });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
      });

      test('should reject subject with unknown fields', async () => {
        const response = await request(app).post('/api/subjects').send({
          name: 'TestSubject',
          code: 'TESTMATH005',
          extraField: 'should fail',
        });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
      });

      test('should reject subject with duplicate code', async () => {
        const response = await request(app).post('/api/subjects').send({
          name: 'TestPhysics',
          code: 'TESTMATH001',
        });

        expect(response.status).toBe(409);
        expect(response.body.success).toBe(false);
      });
    });

    describe('GET /api/subjects - Get All Subjects', () => {
      test('should get all subjects', async () => {
        const response = await request(app).get('/api/subjects');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBeGreaterThan(0);
        expect(response.body.error).toBeNull();
      });

      test('should return subjects with all required fields', async () => {
        const response = await request(app).get('/api/subjects');

        expect(response.status).toBe(200);
        const subject = response.body.data[0];
        expect(subject).toHaveProperty('id');
        expect(subject).toHaveProperty('name');
        expect(subject).toHaveProperty('code');
        expect(subject).toHaveProperty('streams');
        expect(subject).toHaveProperty('scores');
        expect(subject).toHaveProperty('createdAt');
        expect(subject).toHaveProperty('updatedAt');
      });
    });

    describe('GET /api/subjects/:id - Get Subject by ID', () => {
      test('should get subject by valid ID', async () => {
        const response = await request(app).get(`/api/subjects/${subjectId}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(subjectId);
        expect(response.body.data.name).toBe('TestMath');
        expect(response.body.data.code).toBe('TESTMATH001');
        expect(response.body.error).toBeNull();
      });

      test('should return 404 for non-existent subject ID', async () => {
        const response = await request(app).get('/api/subjects/99999');

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('not found');
      });
    });

    describe('PUT /api/subjects/:id - Update Subject', () => {
      test('should update subject name', async () => {
        const response = await request(app).put(`/api/subjects/${subjectId}`).send({
          name: 'Advanced Mathematics',
        });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.name).toBe('Advanced Mathematics');
        expect(response.body.message).toContain('updated');
      });

      test('should update subject code', async () => {
        const response = await request(app).put(`/api/subjects/${subjectId}`).send({
          code: 'TESTMATH001_UPDATED',
        });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.code).toBe('TESTMATH001_UPDATED');
      });

      test('should reject update with empty request body', async () => {
        const response = await request(app).put(`/api/subjects/${subjectId}`).send({});

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
      });

      test('should reject update with invalid name length', async () => {
        const response = await request(app).put(`/api/subjects/${subjectId}`).send({
          name: 'A'.repeat(101),
        });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
      });

      test('should reject update with duplicate code', async () => {
        // First create another subject
        const createResponse = await request(app).post('/api/subjects').send({
          name: 'TestPhysics',
          code: 'TESTPHYSICS001',
        });

        const newSubjectId = createResponse.body.data.id;

        // Try to update it with the code from the first subject
        const response = await request(app).put(`/api/subjects/${newSubjectId}`).send({
          code: 'TESTMATH001_UPDATED',
        });

        expect(response.status).toBe(409);
        expect(response.body.success).toBe(false);
      });
    });

    describe('DELETE /api/subjects/:id - Delete Subject', () => {
      test('should delete subject', async () => {
        // Create a subject to delete
        const createResponse = await request(app).post('/api/subjects').send({
          name: 'ToDelete',
          code: 'TODELETE001',
        });

        const deleteId = createResponse.body.data.id;

        // Delete it
        const response = await request(app).delete(`/api/subjects/${deleteId}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toContain('deleted');

        // Verify it's gone
        const getResponse = await request(app).get(`/api/subjects/${deleteId}`);
        expect(getResponse.status).toBe(404);
      });

      test('should cascade delete stream_subjects records', async () => {
        // Create subject and assign to stream
        const createResponse = await request(app).post('/api/subjects').send({
          name: 'ToCascadeDelete',
          code: 'TOCASCADE001',
        });

        const cascadeSubjectId = createResponse.body.data.id;

        // Assign to stream
        await request(app)
          .post(`/api/subjects/${cascadeSubjectId}/streams`)
          .send({ streamId });

        // Verify assignment exists
        const assignmentCheck = await db.query(
          'SELECT * FROM stream_subjects WHERE subject_id = $1',
          [cascadeSubjectId]
        );
        expect(assignmentCheck.rows.length).toBe(1);

        // Delete subject
        await request(app).delete(`/api/subjects/${cascadeSubjectId}`);

        // Verify stream_subjects record is gone
        const postDeleteCheck = await db.query(
          'SELECT * FROM stream_subjects WHERE subject_id = $1',
          [cascadeSubjectId]
        );
        expect(postDeleteCheck.rows.length).toBe(0);
      });
    });
  });

  describe('Stream-Subject Relationships', () => {
    let relationshipSubjectId = null;

    beforeAll(async () => {
      // Create a subject for relationship tests
      const createResponse = await request(app).post('/api/subjects').send({
        name: 'RelationshipTest',
        code: 'TESTREL001',
      });
      relationshipSubjectId = createResponse.body.data.id;
    });

    describe('POST /api/subjects/:id/streams - Assign Subject to Stream', () => {
      test('should assign subject to stream', async () => {
        const response = await request(app)
          .post(`/api/subjects/${relationshipSubjectId}/streams`)
          .send({ streamId });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toContain('assigned');
        expect(response.body.data.streams.length).toBe(1);
        expect(response.body.data.streams[0].id).toBe(streamId);
      });

      test('should prevent duplicate stream assignment', async () => {
        const response = await request(app)
          .post(`/api/subjects/${relationshipSubjectId}/streams`)
          .send({ streamId });

        expect(response.status).toBe(409);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('already assigned');
      });

      test('should reject assignment with missing streamId', async () => {
        // Create another subject
        const createResponse = await request(app).post('/api/subjects').send({
          name: 'NoStream',
          code: 'TESTNOSTREAM001',
        });

        const noStreamId = createResponse.body.data.id;

        const response = await request(app)
          .post(`/api/subjects/${noStreamId}/streams`)
          .send({});

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
      });

      test('should reject assignment with invalid streamId type', async () => {
        const createResponse = await request(app).post('/api/subjects').send({
          name: 'InvalidStream',
          code: 'TESTINVALID001',
        });

        const invalidStreamSubjectId = createResponse.body.data.id;

        const response = await request(app)
          .post(`/api/subjects/${invalidStreamSubjectId}/streams`)
          .send({ streamId: 'invalid' });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
      });

      test('should assign same subject to multiple streams', async () => {
        // Create second stream
        const stream2Result = await db.query(
          `INSERT INTO class_streams (name, code, description, created_at, updated_at)
           VALUES ($1, $2, $3, now(), now())
           RETURNING id`,
          ['Test Stream 2', 'TEST-STREAM-2', 'Second test stream']
        );
        const stream2Id = stream2Result.rows[0].id;

        // Create subject
        const createResponse = await request(app).post('/api/subjects').send({
          name: 'MultiStream',
          code: 'TESTMULTI001',
        });

        const multiStreamSubjectId = createResponse.body.data.id;

        // Assign to first stream
        const response1 = await request(app)
          .post(`/api/subjects/${multiStreamSubjectId}/streams`)
          .send({ streamId });

        expect(response1.status).toBe(201);

        // Assign to second stream
        const response2 = await request(app)
          .post(`/api/subjects/${multiStreamSubjectId}/streams`)
          .send({ streamId: stream2Id });

        expect(response2.status).toBe(201);
        expect(response2.body.data.streams.length).toBe(2);

        // Cleanup
        await db.query('DELETE FROM class_streams WHERE id = $1', [stream2Id]);
      });
    });

    describe('GET /api/subjects/stream/:streamId - Get Subjects by Stream', () => {
      test('should get subjects for stream', async () => {
        const response = await request(app).get(`/api/subjects/stream/${streamId}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBeGreaterThan(0);
      });

      test('should return empty array for stream with no subjects', async () => {
        // Create stream with no subjects
        const emptyStreamResult = await db.query(
          `INSERT INTO class_streams (name, code, description, created_at, updated_at)
           VALUES ($1, $2, $3, now(), now())
           RETURNING id`,
          ['Empty Stream', 'EMPTY-STREAM', 'Stream with no subjects']
        );
        const emptyStreamId = emptyStreamResult.rows[0].id;

        const response = await request(app).get(`/api/subjects/stream/${emptyStreamId}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual([]);

        // Cleanup
        await db.query('DELETE FROM class_streams WHERE id = $1', [emptyStreamId]);
      });

      test('should return subjects with required fields', async () => {
        const response = await request(app).get(`/api/subjects/stream/${streamId}`);

        expect(response.status).toBe(200);
        if (response.body.data.length > 0) {
          const subject = response.body.data[0];
          expect(subject).toHaveProperty('id');
          expect(subject).toHaveProperty('name');
          expect(subject).toHaveProperty('code');
          expect(subject).toHaveProperty('createdAt');
          expect(subject).toHaveProperty('updatedAt');
        }
      });
    });

    describe('DELETE /api/subjects/:id/streams/:streamId - Remove Subject from Stream', () => {
      test('should remove subject from stream', async () => {
        // Create subject and assign to stream
        const createResponse = await request(app).post('/api/subjects').send({
          name: 'RemoveTest',
          code: 'TESTREMOVE001',
        });

        const removeTestSubjectId = createResponse.body.data.id;

        // Assign to stream
        await request(app)
          .post(`/api/subjects/${removeTestSubjectId}/streams`)
          .send({ streamId });

        // Remove from stream
        const response = await request(app).delete(
          `/api/subjects/${removeTestSubjectId}/streams/${streamId}`
        );

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toContain('removed');

        // Verify it's removed
        const checkResponse = await request(app).get(`/api/subjects/stream/${streamId}`);
        const found = checkResponse.body.data.some((s) => s.id === removeTestSubjectId);
        expect(found).toBe(false);
      });

      test('should reject removal of unassigned subject', async () => {
        const response = await request(app).delete(
          `/api/subjects/${relationshipSubjectId}/streams/${streamId}`
        );

        // Note: relationshipSubjectId was already removed, or never assigned to this stream
        expect([400, 404]).toContain(response.status);
        expect(response.body.success).toBe(false);
      });
    });
  });

  describe('Response Format Validation', () => {
    test('success response should follow standard format', async () => {
      const response = await request(app).get('/api/subjects');

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('error', null);
    });

    test('error response should follow standard format', async () => {
      const response = await request(app).post('/api/subjects').send({
        name: 'M',
        code: 'ERR',
      });

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('data', null);
      expect(response.body).toHaveProperty('error');
    });
  });
});
