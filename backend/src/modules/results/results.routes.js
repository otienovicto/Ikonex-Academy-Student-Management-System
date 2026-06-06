const express = require('express');
const ResultsController = require('./results.controller');

const router = express.Router();

router.get('/class/:streamId/rankings', ResultsController.classRankings);
router.get('/subject/:subjectId/rankings', ResultsController.subjectRankings);
router.get('/student/:studentId/overall', ResultsController.studentOverall);

module.exports = router;
