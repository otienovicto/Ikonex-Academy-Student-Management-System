const db = require('../../config/db');
const GradeCalculator = require('../../utils/gradeCalculator');
const RankingEngine = require('../../utils/rankingEngine');

const ResultsService = {
  async getClassRankings(streamId) {
    const query = `
      SELECT s.id AS student_id, s.first_name, s.last_name,
        COALESCE(SUM(a.marks), 0)::float AS total,
        COALESCE(AVG(a.marks), 0)::float AS average
      FROM students s
      LEFT JOIN assessments a ON s.id = a.student_id
      WHERE s.stream_id = $1
      GROUP BY s.id, s.first_name, s.last_name
    `;

    const { rows } = await db.query(query, [streamId]);

    const mapped = rows.map((r) => ({
      student_id: r.student_id,
      first_name: r.first_name,
      last_name: r.last_name,
      total: Number(Number(r.total).toFixed(2)),
      average: Number(Number(r.average).toFixed(2)),
      grade: GradeCalculator.calculateGrade(Number(r.average)),
    }));

    return RankingEngine.rankByAverage(mapped);
  },

  async getSubjectRankings(subjectId) {
    const query = `
      SELECT a.student_id, s.first_name, s.last_name, a.marks
      FROM assessments a
      JOIN students s ON a.student_id = s.id
      WHERE a.subject_id = $1
    `;

    const { rows } = await db.query(query, [subjectId]);

    const mapped = rows.map((r) => ({
      student_id: r.student_id,
      first_name: r.first_name,
      last_name: r.last_name,
      marks: Number(Number(r.marks).toFixed(2)),
      grade: GradeCalculator.calculateGrade(Number(r.marks)),
    }));

    return RankingEngine.rankByMarks(mapped);
  },

  async getStudentOverall(studentId) {
    // Get student's stream
    const studentRes = await db.query('SELECT id, first_name, last_name, stream_id FROM students WHERE id = $1', [studentId]);
    if (!studentRes.rows.length) throw new Error('Student not found');
    const student = studentRes.rows[0];

    const aggRes = await db.query(
      'SELECT COALESCE(SUM(marks),0)::float AS total, COALESCE(AVG(marks),0)::float AS average FROM assessments WHERE student_id = $1',
      [studentId]
    );

    const { total, average } = aggRes.rows[0];

    // Determine position within the class/stream
    const classRankings = await this.getClassRankings(student.stream_id);
    const found = classRankings.find((r) => Number(r.student_id) === Number(studentId));

    return {
      student_id: student.id,
      first_name: student.first_name,
      last_name: student.last_name,
      total: Number(Number(total).toFixed(2)),
      average: Number(Number(average).toFixed(2)),
      grade: GradeCalculator.calculateGrade(Number(average)),
      position: found ? found.position : null,
    };
  },
};

module.exports = ResultsService;
