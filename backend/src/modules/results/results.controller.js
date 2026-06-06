const asyncHandler = require('../../utils/asyncHandler');
const ResponseFormatter = require('../../utils/responseFormatter');
const ResultsService = require('./results.service');

const ResultsController = {
  classRankings: asyncHandler(async (req, res) => {
    const streamId = parseInt(req.params.streamId, 10);
    const data = await ResultsService.getClassRankings(streamId);
    return ResponseFormatter.success(res, data);
  }),

  subjectRankings: asyncHandler(async (req, res) => {
    const subjectId = parseInt(req.params.subjectId, 10);
    const data = await ResultsService.getSubjectRankings(subjectId);
    return ResponseFormatter.success(res, data);
  }),

  studentOverall: asyncHandler(async (req, res) => {
    const studentId = parseInt(req.params.studentId, 10);
    const data = await ResultsService.getStudentOverall(studentId);
    return ResponseFormatter.success(res, data);
  }),
};

module.exports = ResultsController;
