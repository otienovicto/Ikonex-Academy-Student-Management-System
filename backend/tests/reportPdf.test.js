const request = require('supertest');
const app = require('../src/app');

const puppeteerAvailable = (() => {
  try {
    require.resolve('puppeteer');
    return true;
  } catch (e) {
    return false;
  }
})();

describe('Report PDF Endpoints', () => {
  if (!puppeteerAvailable) {
    test('puppeteer not installed - skipping PDF generation tests', () => {
      expect(true).toBe(true);
    });
    return;
  }

  test('GET /api/reports/student/:studentId/pdf returns PDF', async () => {
    // This test assumes a student with ID 1 exists and has scores
    const res = await request(app).get('/api/reports/student/1/pdf');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('application/pdf');
  }, 20000);

  test('GET /api/reports/class/:streamId/pdf returns PDF', async () => {
    const res = await request(app).get('/api/reports/class/1/pdf');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('application/pdf');
  }, 20000);
});
