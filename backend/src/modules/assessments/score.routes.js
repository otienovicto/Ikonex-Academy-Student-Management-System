// Score Routes
const express = require('express');
const ScoreController = require('./score.controller');
const validateRequest = require('../../middlewares/validate.middleware');
const ScoreValidation = require('./score.validation');

const router = express.Router();

router.get('/', ScoreController.getAllScores);
router.post('/', validateRequest(ScoreValidation.createSchema), ScoreController.createScore);
router.get('/student/:studentId/aggregates', ScoreController.getStudentAggregates);
router.get('/subject/:subjectId/aggregates', ScoreController.getSubjectAggregates);
router.get('/student/:studentId', ScoreController.getStudentPerformance);
router.get('/subject/:subjectId', ScoreController.getSubjectPerformance);
router.get('/student/:studentId/subject/:subjectId', ScoreController.getStudentSubjectPerformance);
router.get('/:id', ScoreController.getScoreById);
router.put('/:id', validateRequest(ScoreValidation.updateSchema), ScoreController.updateScore);
router.delete('/:id', ScoreController.deleteScore);

module.exports = router;
