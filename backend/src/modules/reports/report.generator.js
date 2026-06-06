// Report Generator
const GradeCalculator = require('../../utils/gradeCalculator');
const RankingEngine = require('../../utils/rankingEngine');

const ReportGenerator = {
  generateStudentReport(student) {
    const report = {
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      stream: student.stream.name,
      subjects: [],
      totalMarks: 0,
      averageMarks: 0,
      grade: '',
    };

    student.scores.forEach((score) => {
      report.subjects.push({
        subject: score.subject.name,
        marks: score.marks,
        grade: GradeCalculator.calculateGrade(score.marks),
      });
      report.totalMarks += score.marks;
    });

    report.averageMarks = Math.round(report.totalMarks / student.scores.length);
    report.grade = GradeCalculator.calculateGrade(report.averageMarks);

    return report;
  },

  generateClassReport(stream) {
    const report = {
      stream: stream.name,
      totalStudents: stream.students.length,
      classAverage: 0,
      topPerformers: [],
      subjects: {},
    };

    let totalMarks = 0;
    const studentReports = [];

    stream.students.forEach((student) => {
      const studentMarks = student.scores.reduce((sum, score) => sum + score.marks, 0);
      const studentAverage = Math.round(studentMarks / student.scores.length);
      totalMarks += studentAverage;

      studentReports.push({
        name: `${student.firstName} ${student.lastName}`,
        average: studentAverage,
      });
    });

    report.classAverage = Math.round(totalMarks / stream.students.length);
    report.topPerformers = studentReports.sort((a, b) => b.average - a.average).slice(0, 5);

    return report;
  },

  generateRankingReport(stream) {
    const rankings = RankingEngine.rankStudents(stream.students);

    return {
      stream: stream.name,
      generatedAt: new Date(),
      rankings: rankings,
    };
  },
};

module.exports = ReportGenerator;
