// Report Service
const StudentService = require('../students/student.service');
const StreamService = require('../streams/stream.service');
const ReportGenerator = require('./report.generator');

const ReportService = {
  async generateStudentReport(studentId) {
    const student = await StudentService.getStudentById(studentId);

    if (!student) {
      throw new Error('Student not found');
    }

    return ReportGenerator.generateStudentReport(student);
  },

  async generateClassReport(streamId) {
    const stream = await StreamService.getStreamById(streamId);

    if (!stream) {
      throw new Error('Stream not found');
    }

    return ReportGenerator.generateClassReport(stream);
  },

  async generateRankingReport(streamId) {
    const stream = await StreamService.getStreamById(streamId);

    if (!stream) {
      throw new Error('Stream not found');
    }

    return ReportGenerator.generateRankingReport(stream);
  },
};

module.exports = ReportService;
