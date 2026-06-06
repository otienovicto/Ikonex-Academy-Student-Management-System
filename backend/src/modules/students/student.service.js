// Student Service
const db = require('../../config/db');

const StudentService = {
  async getAllStudents() {
    const studentsResult = await db.query(
      `SELECT
         s.id,
         s.registration_number,
         s.first_name,
         s.last_name,
         s.email,
         s.date_of_birth,
         s.stream_id,
         cs.name AS stream_name,
         cs.code AS stream_code,
         cs.description AS stream_description,
         s.created_at,
         s.updated_at
       FROM students s
       LEFT JOIN class_streams cs ON s.stream_id = cs.id
       ORDER BY s.id`
    );

    const scoresResult = await db.query(
      `SELECT
         a.id,
         a.student_id,
         a.subject_id,
         a.marks,
         a.assessment_type,
         a.created_at,
         a.updated_at,
         sub.name AS subject_name,
         sub.code AS subject_code
       FROM assessments a
       LEFT JOIN subjects sub ON a.subject_id = sub.id
       ORDER BY a.id`
    );

    const scoresByStudent = scoresResult.rows.reduce((acc, row) => {
      acc[row.student_id] = acc[row.student_id] || [];
      acc[row.student_id].push({
        id: row.id,
        studentId: row.student_id,
        subjectId: row.subject_id,
        subject: {
          id: row.subject_id,
          name: row.subject_name,
          code: row.subject_code,
        },
        marks: row.marks,
        assessmentType: row.assessment_type,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      });
      return acc;
    }, {});

    return studentsResult.rows.map((row) => ({
      id: row.id,
      registrationNumber: row.registration_number,
      firstName: row.first_name,
      lastName: row.last_name,
      email: row.email,
      dateOfBirth: row.date_of_birth,
      stream: row.stream_id
        ? {
            id: row.stream_id,
            name: row.stream_name,
            code: row.stream_code,
            description: row.stream_description,
          }
        : null,
      scores: scoresByStudent[row.id] || [],
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  },

  async getStudentById(id) {
    const studentResult = await db.query(
      `SELECT
         s.id,
         s.registration_number,
         s.first_name,
         s.last_name,
         s.email,
         s.date_of_birth,
         s.stream_id,
         cs.name AS stream_name,
         cs.code AS stream_code,
         cs.description AS stream_description,
         s.created_at,
         s.updated_at
       FROM students s
       LEFT JOIN class_streams cs ON s.stream_id = cs.id
       WHERE s.id = $1`,
      [parseInt(id, 10)]
    );

    if (studentResult.rows.length === 0) {
      return null;
    }

    const studentRow = studentResult.rows[0];
    const scoresResult = await db.query(
      `SELECT
         a.id,
         a.student_id,
         a.subject_id,
         a.marks,
         a.assessment_type,
         a.created_at,
         a.updated_at,
         sub.name AS subject_name,
         sub.code AS subject_code
       FROM assessments a
       LEFT JOIN subjects sub ON a.subject_id = sub.id
       WHERE a.student_id = $1
       ORDER BY a.id`,
      [parseInt(id, 10)]
    );

    return {
      id: studentRow.id,
      registrationNumber: studentRow.registration_number,
      firstName: studentRow.first_name,
      lastName: studentRow.last_name,
      email: studentRow.email,
      dateOfBirth: studentRow.date_of_birth,
      stream: studentRow.stream_id
        ? {
            id: studentRow.stream_id,
            name: studentRow.stream_name,
            code: studentRow.stream_code,
            description: studentRow.stream_description,
          }
        : null,
      scores: scoresResult.rows.map((row) => ({
        id: row.id,
        studentId: row.student_id,
        subjectId: row.subject_id,
        subject: {
          id: row.subject_id,
          name: row.subject_name,
          code: row.subject_code,
        },
        marks: row.marks,
        assessmentType: row.assessment_type,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      })),
      createdAt: studentRow.created_at,
      updatedAt: studentRow.updated_at,
    };
  },

  async createStudent(data) {
    const { rows } = await db.query(
      `INSERT INTO students (registration_number, first_name, last_name, email, date_of_birth, stream_id, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, now(), now())
       RETURNING id`,
      [
        data.registrationNumber,
        data.firstName,
        data.lastName,
        data.email,
        new Date(data.dateOfBirth),
        data.streamId,
      ]
    );

    return this.getStudentById(rows[0].id);
  },

  async updateStudent(id, data) {
    const fields = [];
    const values = [];
    let index = 1;

    if (data.registrationNumber) {
      fields.push(`registration_number = $${index++}`);
      values.push(data.registrationNumber);
    }
    if (data.firstName) {
      fields.push(`first_name = $${index++}`);
      values.push(data.firstName);
    }
    if (data.lastName) {
      fields.push(`last_name = $${index++}`);
      values.push(data.lastName);
    }
    if (data.email) {
      fields.push(`email = $${index++}`);
      values.push(data.email);
    }
    if (data.dateOfBirth) {
      fields.push(`date_of_birth = $${index++}`);
      values.push(new Date(data.dateOfBirth));
    }
    if (data.streamId) {
      fields.push(`stream_id = $${index++}`);
      values.push(data.streamId);
    }

    if (fields.length === 0) {
      return this.getStudentById(id);
    }

    values.push(parseInt(id, 10));
    await db.query(
      `UPDATE students SET ${fields.join(', ')}, updated_at = now() WHERE id = $${index}`,
      values
    );

    return this.getStudentById(id);
  },

  async getStudentsByStream(streamId) {
    const studentsResult = await db.query(
      `SELECT
         s.id,
         s.registration_number,
         s.first_name,
         s.last_name,
         s.email,
         s.date_of_birth,
         s.stream_id,
         cs.name AS stream_name,
         cs.code AS stream_code,
         cs.description AS stream_description,
         s.created_at,
         s.updated_at
       FROM students s
       LEFT JOIN class_streams cs ON s.stream_id = cs.id
       WHERE s.stream_id = $1
       ORDER BY s.id`,
      [parseInt(streamId, 10)]
    );

    if (studentsResult.rows.length === 0) {
      return [];
    }

    const scoresResult = await db.query(
      `SELECT
         a.id,
         a.student_id,
         a.subject_id,
         a.marks,
         a.assessment_type,
         a.created_at,
         a.updated_at,
         sub.name AS subject_name,
         sub.code AS subject_code
       FROM assessments a
       LEFT JOIN subjects sub ON a.subject_id = sub.id
       WHERE a.student_id IN (SELECT id FROM students WHERE stream_id = $1)
       ORDER BY a.id`,
      [parseInt(streamId, 10)]
    );

    const scoresByStudent = scoresResult.rows.reduce((acc, row) => {
      acc[row.student_id] = acc[row.student_id] || [];
      acc[row.student_id].push({
        id: row.id,
        studentId: row.student_id,
        subjectId: row.subject_id,
        subject: {
          id: row.subject_id,
          name: row.subject_name,
          code: row.subject_code,
        },
        marks: row.marks,
        assessmentType: row.assessment_type,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      });
      return acc;
    }, {});

    return studentsResult.rows.map((row) => ({
      id: row.id,
      registrationNumber: row.registration_number,
      firstName: row.first_name,
      lastName: row.last_name,
      email: row.email,
      dateOfBirth: row.date_of_birth,
      stream: row.stream_id
        ? {
            id: row.stream_id,
            name: row.stream_name,
            code: row.stream_code,
            description: row.stream_description,
          }
        : null,
      scores: scoresByStudent[row.id] || [],
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  },
};

module.exports = StudentService;
