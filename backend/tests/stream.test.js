// Stream Module Integration Tests
const request = require('supertest');
const app = require('../src/app');

describe('Stream Module API Tests', () => {
  let streamId;

  describe('POST /api/streams - Create Stream', () => {
    it('should create a new stream with valid data', async () => {
      const res = await request(app)
        .post('/api/streams')
        .send({
          name: 'Test Stream',
          code: 'TST001',
          description: 'Test stream description',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.name).toBe('Test Stream');
      streamId = res.body.data.id;
    });

    it('should fail with missing required fields', async () => {
      const res = await request(app)
        .post('/api/streams')
        .send({
          name: 'Test Stream',
          // code is missing
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should fail with invalid field lengths', async () => {
      const res = await request(app)
        .post('/api/streams')
        .send({
          name: 'A', // too short
          code: 'TST001',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/streams - Get All Streams', () => {
    it('should retrieve all streams', async () => {
      const res = await request(app)
        .get('/api/streams');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('GET /api/streams/:id - Get Stream by ID', () => {
    it('should retrieve a specific stream', async () => {
      const res = await request(app)
        .get(`/api/streams/${streamId}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(streamId);
    });

    it('should return 404 for non-existent stream', async () => {
      const res = await request(app)
        .get('/api/streams/99999');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/streams/:id - Update Stream', () => {
    it('should update stream with valid data', async () => {
      const res = await request(app)
        .put(`/api/streams/${streamId}`)
        .send({
          name: 'Updated Stream Name',
          description: 'Updated description',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Updated Stream Name');
    });

    it('should fail if no fields to update', async () => {
      const res = await request(app)
        .put(`/api/streams/${streamId}`)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/streams/:id - Delete Stream', () => {
    it('should delete a stream successfully', async () => {
      const res = await request(app)
        .delete(`/api/streams/${streamId}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should confirm stream is deleted', async () => {
      const res = await request(app)
        .get(`/api/streams/${streamId}`);

      expect(res.status).toBe(404);
    });
  });
});

/**
 * Test Execution:
 * Install supertest: npm install --save-dev supertest
 * Run tests: npm test -- stream.test.js
 */
