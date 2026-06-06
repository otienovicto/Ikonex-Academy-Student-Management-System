// Stream Service
const db = require('../../config/db');

const StreamService = {
  async getAllStreams() {
    const streamsResult = await db.query(
      `SELECT id, name, code, description, created_at, updated_at FROM class_streams ORDER BY id`
    );

    const studentsResult = await db.query(
      `SELECT id, registration_number, first_name, last_name, email, date_of_birth, stream_id, created_at, updated_at
       FROM students
       ORDER BY id`
    );

    const subjectResult = await db.query(
      `SELECT ss.stream_id, sub.id AS subject_id, sub.name, sub.code, sub.created_at, sub.updated_at
       FROM stream_subjects ss
       JOIN subjects sub ON ss.subject_id = sub.id
       ORDER BY sub.id`
    );

    const studentsByStream = studentsResult.rows.reduce((acc, row) => {
      acc[row.stream_id] = acc[row.stream_id] || [];
      acc[row.stream_id].push({
        id: row.id,
        registrationNumber: row.registration_number,
        firstName: row.first_name,
        lastName: row.last_name,
        email: row.email,
        dateOfBirth: row.date_of_birth,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      });
      return acc;
    }, {});

    const subjectsByStream = subjectResult.rows.reduce((acc, row) => {
      acc[row.stream_id] = acc[row.stream_id] || [];
      acc[row.stream_id].push({
        id: row.subject_id,
        name: row.name,
        code: row.code,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      });
      return acc;
    }, {});

    return streamsResult.rows.map((row) => ({
      id: row.id,
      name: row.name,
      code: row.code,
      description: row.description,
      students: studentsByStream[row.id] || [],
      subjects: subjectsByStream[row.id] || [],
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  },

  async getStreamById(id) {
    const streamResult = await db.query(
      `SELECT id, name, code, description, created_at, updated_at FROM class_streams WHERE id = $1`,
      [parseInt(id, 10)]
    );

    if (streamResult.rows.length === 0) {
      return null;
    }

    const streamRow = streamResult.rows[0];

    const studentsResult = await db.query(
      `SELECT id, registration_number, first_name, last_name, email, date_of_birth, stream_id, created_at, updated_at
       FROM students
       WHERE stream_id = $1
       ORDER BY id`,
      [parseInt(id, 10)]
    );

    const subjectResult = await db.query(
      `SELECT sub.id AS subject_id, sub.name, sub.code, sub.created_at, sub.updated_at
       FROM stream_subjects ss
       JOIN subjects sub ON ss.subject_id = sub.id
       WHERE ss.stream_id = $1
       ORDER BY sub.id`,
      [parseInt(id, 10)]
    );

    return {
      id: streamRow.id,
      name: streamRow.name,
      code: streamRow.code,
      description: streamRow.description,
      students: studentsResult.rows.map((row) => ({
        id: row.id,
        registrationNumber: row.registration_number,
        firstName: row.first_name,
        lastName: row.last_name,
        email: row.email,
        dateOfBirth: row.date_of_birth,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      })),
      subjects: subjectResult.rows.map((row) => ({
        id: row.subject_id,
        name: row.name,
        code: row.code,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      })),
      createdAt: streamRow.created_at,
      updatedAt: streamRow.updated_at,
    };
  },

  async createStream(data) {
    const { rows } = await db.query(
      `INSERT INTO class_streams (name, code, description, created_at, updated_at)
       VALUES ($1, $2, $3, now(), now())
       RETURNING id`,
      [data.name, data.code, data.description || null]
    );

    return this.getStreamById(rows[0].id);
  },

  async updateStream(id, data) {
    const fields = [];
    const values = [];
    let index = 1;

    if (data.name) {
      fields.push(`name = $${index++}`);
      values.push(data.name);
    }
    if (data.code) {
      fields.push(`code = $${index++}`);
      values.push(data.code);
    }
    if (data.description !== undefined) {
      fields.push(`description = $${index++}`);
      values.push(data.description);
    }

    if (fields.length === 0) {
      return this.getStreamById(id);
    }

    values.push(parseInt(id, 10));
    await db.query(
      `UPDATE class_streams SET ${fields.join(', ')}, updated_at = now() WHERE id = $${index}`,
      values
    );

    return this.getStreamById(id);
  },

  async deleteStream(id) {
    await db.query('DELETE FROM class_streams WHERE id = $1', [parseInt(id, 10)]);
  },
};

module.exports = StreamService;
