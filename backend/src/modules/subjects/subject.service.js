// Subject Service
const db = require('../../config/db');

const SubjectService = {
  async getAllSubjects() {
    const subjectsResult = await db.query(
      `SELECT id, name, code, created_at, updated_at FROM subjects ORDER BY id`
    );

    const streamRelations = await db.query(
      `SELECT ss.subject_id, cs.id AS stream_id, cs.name, cs.code, cs.description
       FROM stream_subjects ss
       JOIN class_streams cs ON ss.stream_id = cs.id
       ORDER BY cs.id`
    );

    const scoresResult = await db.query(
      `SELECT a.id, a.student_id, a.subject_id, a.marks, a.assessment_type, a.created_at, a.updated_at,
              s.registration_number, s.first_name, s.last_name, s.email
       FROM assessments a
       JOIN students s ON a.student_id = s.id
       ORDER BY a.id`
    );

    const streamsBySubject = streamRelations.rows.reduce((acc, row) => {
      acc[row.subject_id] = acc[row.subject_id] || [];
      acc[row.subject_id].push({
        id: row.stream_id,
        name: row.name,
        code: row.code,
        description: row.description,
      });
      return acc;
    }, {});

    const scoresBySubject = scoresResult.rows.reduce((acc, row) => {
      acc[row.subject_id] = acc[row.subject_id] || [];
      acc[row.subject_id].push({
        id: row.id,
        studentId: row.student_id,
        marks: row.marks,
        assessmentType: row.assessment_type,
        student: {
          registrationNumber: row.registration_number,
          firstName: row.first_name,
          lastName: row.last_name,
          email: row.email,
        },
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      });
      return acc;
    }, {});

    return subjectsResult.rows.map((row) => ({
      id: row.id,
      name: row.name,
      code: row.code,
      streams: streamsBySubject[row.id] || [],
      scores: scoresBySubject[row.id] || [],
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  },

  async getSubjectById(id) {
    const subjectResult = await db.query(
      `SELECT id, name, code, created_at, updated_at FROM subjects WHERE id = $1`,
      [parseInt(id, 10)]
    );

    if (subjectResult.rows.length === 0) {
      return null;
    }

    const subjectRow = subjectResult.rows[0];

    const streamRelations = await db.query(
      `SELECT cs.id AS stream_id, cs.name, cs.code, cs.description
       FROM stream_subjects ss
       JOIN class_streams cs ON ss.stream_id = cs.id
       WHERE ss.subject_id = $1
       ORDER BY cs.id`,
      [parseInt(id, 10)]
    );

    const scoresResult = await db.query(
      `SELECT a.id, a.student_id, a.subject_id, a.marks, a.assessment_type, a.created_at, a.updated_at,
              s.registration_number, s.first_name, s.last_name, s.email
       FROM assessments a
       JOIN students s ON a.student_id = s.id
       WHERE a.subject_id = $1
       ORDER BY a.id`,
      [parseInt(id, 10)]
    );

    return {
      id: subjectRow.id,
      name: subjectRow.name,
      code: subjectRow.code,
      streams: streamRelations.rows.map((row) => ({
        id: row.stream_id,
        name: row.name,
        code: row.code,
        description: row.description,
      })),
      scores: scoresResult.rows.map((row) => ({
        id: row.id,
        studentId: row.student_id,
        marks: row.marks,
        assessmentType: row.assessment_type,
        student: {
          registrationNumber: row.registration_number,
          firstName: row.first_name,
          lastName: row.last_name,
          email: row.email,
        },
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      })),
      createdAt: subjectRow.created_at,
      updatedAt: subjectRow.updated_at,
    };
  },

  async createSubject(data) {
    const { rows } = await db.query(
      `INSERT INTO subjects (name, code, created_at, updated_at)
       VALUES ($1, $2, now(), now())
       RETURNING id`,
      [data.name, data.code]
    );

    return this.getSubjectById(rows[0].id);
  },

  async updateSubject(id, data) {
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

    if (fields.length === 0) {
      return this.getSubjectById(id);
    }

    values.push(parseInt(id, 10));
    await db.query(
      `UPDATE subjects SET ${fields.join(', ')}, updated_at = now() WHERE id = $${index}`,
      values
    );

    return this.getSubjectById(id);
  },

  async deleteSubject(id) {
    await db.query('DELETE FROM subjects WHERE id = $1', [parseInt(id, 10)]);
  },

  async getSubjectsByStream(streamId) {
    const subjectsResult = await db.query(
      `SELECT s.id, s.name, s.code, s.created_at, s.updated_at
       FROM subjects s
       JOIN stream_subjects ss ON s.id = ss.subject_id
       WHERE ss.stream_id = $1
       ORDER BY s.id`,
      [parseInt(streamId, 10)]
    );

    return subjectsResult.rows.map((row) => ({
      id: row.id,
      name: row.name,
      code: row.code,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  },

  async assignSubjectToStream(subjectId, streamId) {
    try {
      await db.query(
        `INSERT INTO stream_subjects (stream_id, subject_id)
         VALUES ($1, $2)
         RETURNING *`,
        [parseInt(streamId, 10), parseInt(subjectId, 10)]
      );
      return true;
    } catch (error) {
      if (error.code === '23505') {
        // Unique constraint violation - subject already assigned to this stream
        throw new Error('Subject is already assigned to this stream');
      }
      throw error;
    }
  },

  async removeSubjectFromStream(subjectId, streamId) {
    const { rowCount } = await db.query(
      `DELETE FROM stream_subjects
       WHERE stream_id = $1 AND subject_id = $2`,
      [parseInt(streamId, 10), parseInt(subjectId, 10)]
    );

    if (rowCount === 0) {
      throw new Error('Subject is not assigned to this stream');
    }

    return true;
  },
};

module.exports = SubjectService;
