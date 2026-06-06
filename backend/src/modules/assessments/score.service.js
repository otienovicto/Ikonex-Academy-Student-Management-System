// Score Service
const db = require('../../config/db');

const ScoreService = {
  async getAllScores() {
    const result = await db.query(
      `SELECT
         a.id,
         a.marks,
         a.assessment_type,
         a.created_at,
         a.updated_at,
         s.id AS student_id,
         s.registration_number,
         s.first_name,
         s.last_name,
         s.email AS student_email,
         sub.id AS subject_id,
         sub.name AS subject_name,
         sub.code AS subject_code
       FROM assessments a
       JOIN students s ON a.student_id = s.id
       JOIN subjects sub ON a.subject_id = sub.id
       ORDER BY a.id`
    );

    return result.rows.map((row) => ({
      id: row.id,
      marks: row.marks,
      assessmentType: row.assessment_type,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      student: {
        id: row.student_id,
        registrationNumber: row.registration_number,
        firstName: row.first_name,
        lastName: row.last_name,
        email: row.student_email,
      },
      subject: {
        id: row.subject_id,
        name: row.subject_name,
        code: row.subject_code,
      },
    }));
  },

  async getScoreById(id) {
    const result = await db.query(
      `SELECT
         a.id,
         a.marks,
         a.assessment_type,
         a.created_at,
         a.updated_at,
         s.id AS student_id,
         s.registration_number,
         s.first_name,
         s.last_name,
         s.email AS student_email,
         sub.id AS subject_id,
         sub.name AS subject_name,
         sub.code AS subject_code
       FROM assessments a
       JOIN students s ON a.student_id = s.id
       JOIN subjects sub ON a.subject_id = sub.id
       WHERE a.id = $1`,
      [parseInt(id, 10)]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id,
      marks: row.marks,
      assessmentType: row.assessment_type,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      student: {
        id: row.student_id,
        registrationNumber: row.registration_number,
        firstName: row.first_name,
        lastName: row.last_name,
        email: row.student_email,
      },
      subject: {
        id: row.subject_id,
        name: row.subject_name,
        code: row.subject_code,
      },
    };
  },

  async createScore(data) {
    try {
      const insertResult = await db.query(
        `INSERT INTO assessments (student_id, subject_id, marks, assessment_type, created_at, updated_at)
         VALUES ($1, $2, $3, $4, now(), now())
         RETURNING id`,
        [data.studentId, data.subjectId, data.marks, data.assessmentType]
      );

      return this.getScoreById(insertResult.rows[0].id);
    } catch (error) {
      if (error.code === '23505') {
        // Unique constraint violation - score already exists for this student + subject
        throw new Error('A score already exists for this student and subject combination');
      }
      if (error.code === '23503') {
        // Foreign key constraint violation
        throw new Error('Invalid student ID or subject ID');
      }
      throw error;
    }
  },

  async updateScore(id, data) {
    const fields = [];
    const values = [];
    let index = 1;

    if (data.marks !== undefined) {
      fields.push(`marks = $${index++}`);
      values.push(data.marks);
    }
    if (data.assessmentType) {
      fields.push(`assessment_type = $${index++}`);
      values.push(data.assessmentType);
    }

    if (fields.length === 0) {
      return this.getScoreById(id);
    }

    values.push(parseInt(id, 10));
    await db.query(
      `UPDATE assessments SET ${fields.join(', ')}, updated_at = now() WHERE id = $${index}`,
      values
    );

    return this.getScoreById(id);
  },

  async deleteScore(id) {
    await db.query('DELETE FROM assessments WHERE id = $1', [parseInt(id, 10)]);
  },

  async getStudentPerformance(studentId) {
    const result = await db.query(
      `SELECT
         a.id,
         a.marks,
         a.assessment_type,
         a.created_at,
         a.updated_at,
         s.id AS student_id,
         s.registration_number,
         s.first_name,
         s.last_name,
         s.email AS student_email,
         sub.id AS subject_id,
         sub.name AS subject_name,
         sub.code AS subject_code
       FROM assessments a
       JOIN students s ON a.student_id = s.id
       JOIN subjects sub ON a.subject_id = sub.id
       WHERE a.student_id = $1
       ORDER BY sub.name, a.created_at DESC`,
      [parseInt(studentId, 10)]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const studentData = result.rows[0];
    return {
      student: {
        id: studentData.student_id,
        registrationNumber: studentData.registration_number,
        firstName: studentData.first_name,
        lastName: studentData.last_name,
        email: studentData.student_email,
      },
      scores: result.rows.map((row) => ({
        id: row.id,
        marks: row.marks,
        assessmentType: row.assessment_type,
        subject: {
          id: row.subject_id,
          name: row.subject_name,
          code: row.subject_code,
        },
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      })),
    };
  },

  async getSubjectPerformance(subjectId) {
    const result = await db.query(
      `SELECT
         a.id,
         a.marks,
         a.assessment_type,
         a.created_at,
         a.updated_at,
         s.id AS student_id,
         s.registration_number,
         s.first_name,
         s.last_name,
         s.email AS student_email,
         sub.id AS subject_id,
         sub.name AS subject_name,
         sub.code AS subject_code
       FROM assessments a
       JOIN students s ON a.student_id = s.id
       JOIN subjects sub ON a.subject_id = sub.id
       WHERE a.subject_id = $1
       ORDER BY s.first_name, s.last_name, a.created_at DESC`,
      [parseInt(subjectId, 10)]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const subjectData = result.rows[0];
    return {
      subject: {
        id: subjectData.subject_id,
        name: subjectData.subject_name,
        code: subjectData.subject_code,
      },
      scores: result.rows.map((row) => ({
        id: row.id,
        marks: row.marks,
        assessmentType: row.assessment_type,
        student: {
          id: row.student_id,
          registrationNumber: row.registration_number,
          firstName: row.first_name,
          lastName: row.last_name,
          email: row.student_email,
        },
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      })),
    };
  },

  async getStudentAggregates(studentId) {
    const result = await db.query(
      `SELECT
         s.id,
         s.registration_number,
         s.first_name,
         s.last_name,
         s.email,
         COUNT(a.id) AS total_assessments,
         AVG(a.marks) AS average_marks,
         MIN(a.marks) AS min_marks,
         MAX(a.marks) AS max_marks,
         STRING_AGG(DISTINCT sub.name, ', ') AS subjects_taken
       FROM students s
       LEFT JOIN assessments a ON s.id = a.student_id
       LEFT JOIN subjects sub ON a.subject_id = sub.id
       WHERE s.id = $1
       GROUP BY s.id, s.registration_number, s.first_name, s.last_name, s.email`,
      [parseInt(studentId, 10)]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      student: {
        id: row.id,
        registrationNumber: row.registration_number,
        firstName: row.first_name,
        lastName: row.last_name,
        email: row.email,
      },
      statistics: {
        totalAssessments: parseInt(row.total_assessments) || 0,
        averageMarks: row.average_marks ? parseFloat(row.average_marks).toFixed(2) : null,
        minMarks: row.min_marks ? parseFloat(row.min_marks).toFixed(2) : null,
        maxMarks: row.max_marks ? parseFloat(row.max_marks).toFixed(2) : null,
        subjectsTaken: row.subjects_taken ? row.subjects_taken.split(', ') : [],
      },
    };
  },

  async getSubjectAggregates(subjectId) {
    const result = await db.query(
      `SELECT
         sub.id,
         sub.name,
         sub.code,
         COUNT(a.id) AS total_scores,
         AVG(a.marks) AS class_average,
         MIN(a.marks) AS min_marks,
         MAX(a.marks) AS max_marks,
         PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY a.marks) AS median_marks,
         COUNT(DISTINCT a.student_id) AS students_assessed
       FROM subjects sub
       LEFT JOIN assessments a ON sub.id = a.subject_id
       WHERE sub.id = $1
       GROUP BY sub.id, sub.name, sub.code`,
      [parseInt(subjectId, 10)]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      subject: {
        id: row.id,
        name: row.name,
        code: row.code,
      },
      statistics: {
        totalScores: parseInt(row.total_scores) || 0,
        classAverage: row.class_average ? parseFloat(row.class_average).toFixed(2) : null,
        minMarks: row.min_marks ? parseFloat(row.min_marks).toFixed(2) : null,
        maxMarks: row.max_marks ? parseFloat(row.max_marks).toFixed(2) : null,
        medianMarks: row.median_marks ? parseFloat(row.median_marks).toFixed(2) : null,
        studentsAssessed: parseInt(row.students_assessed) || 0,
      },
    };
  },

  async getStudentSubjectPerformance(studentId, subjectId) {
    const result = await db.query(
      `SELECT
         a.id,
         a.marks,
         a.assessment_type,
         a.created_at,
         a.updated_at,
         s.id AS student_id,
         s.registration_number,
         s.first_name,
         s.last_name,
         s.email AS student_email,
         sub.id AS subject_id,
         sub.name AS subject_name,
         sub.code AS subject_code
       FROM assessments a
       JOIN students s ON a.student_id = s.id
       JOIN subjects sub ON a.subject_id = sub.id
       WHERE a.student_id = $1 AND a.subject_id = $2`,
      [parseInt(studentId, 10), parseInt(subjectId, 10)]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id,
      marks: row.marks,
      assessmentType: row.assessment_type,
      student: {
        id: row.student_id,
        registrationNumber: row.registration_number,
        firstName: row.first_name,
        lastName: row.last_name,
        email: row.student_email,
      },
      subject: {
        id: row.subject_id,
        name: row.subject_name,
        code: row.subject_code,
      },
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  },
};

module.exports = ScoreService;
