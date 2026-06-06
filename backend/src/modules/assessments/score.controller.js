// Score Controller
const asyncHandler = require('../../utils/asyncHandler');
const ResponseFormatter = require('../../utils/responseFormatter');
const ScoreService = require('./score.service');

const ScoreController = {
  getAllScores: asyncHandler(async (req, res) => {
    const scores = await ScoreService.getAllScores();
    res.status(200).json(ResponseFormatter.success(scores));
  }),

  getScoreById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const score = await ScoreService.getScoreById(id);
    if (!score) {
      return res.status(404).json(ResponseFormatter.error('Score not found'));
    }
    res.status(200).json(ResponseFormatter.success(score));
  }),

  createScore: asyncHandler(async (req, res) => {
    const score = await ScoreService.createScore(req.body);
    res.status(201).json(ResponseFormatter.success(score, 'Score created successfully'));
  }),

  updateScore: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const score = await ScoreService.updateScore(id, req.body);
    if (!score) {
      return res.status(404).json(ResponseFormatter.error('Score not found'));
    }
    res.status(200).json(ResponseFormatter.success(score, 'Score updated successfully'));
  }),

  deleteScore: asyncHandler(async (req, res) => {
    await ScoreService.deleteScore(req.params.id);
    res.status(200).json(ResponseFormatter.success(null, 'Score deleted successfully'));
  }),

  getStudentPerformance: asyncHandler(async (req, res) => {
    const { studentId } = req.params;
    const performance = await ScoreService.getStudentPerformance(studentId);
    if (!performance) {
      return res.status(404).json(ResponseFormatter.error('Student not found or has no scores'));
    }
    res.status(200).json(ResponseFormatter.success(performance));
  }),

  getSubjectPerformance: asyncHandler(async (req, res) => {
    const { subjectId } = req.params;
    const performance = await ScoreService.getSubjectPerformance(subjectId);
    if (!performance) {
      return res.status(404).json(ResponseFormatter.error('Subject not found or has no scores'));
    }
    res.status(200).json(ResponseFormatter.success(performance));
  }),

  getStudentAggregates: asyncHandler(async (req, res) => {
    const { studentId } = req.params;
    const aggregates = await ScoreService.getStudentAggregates(studentId);
    if (!aggregates) {
      return res.status(404).json(ResponseFormatter.error('Student not found'));
    }
    res.status(200).json(ResponseFormatter.success(aggregates));
  }),

  getSubjectAggregates: asyncHandler(async (req, res) => {
    const { subjectId } = req.params;
    const aggregates = await ScoreService.getSubjectAggregates(subjectId);
    if (!aggregates) {
      return res.status(404).json(ResponseFormatter.error('Subject not found'));
    }
    res.status(200).json(ResponseFormatter.success(aggregates));
  }),

  getStudentSubjectPerformance: asyncHandler(async (req, res) => {
    const { studentId, subjectId } = req.params;
    const performance = await ScoreService.getStudentSubjectPerformance(studentId, subjectId);
    if (!performance) {
      return res.status(404).json(ResponseFormatter.error('No score found for this student and subject'));
    }
    res.status(200).json(ResponseFormatter.success(performance));
  }),
};

module.exports = ScoreController;
