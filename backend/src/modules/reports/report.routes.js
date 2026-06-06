const express = require('express');
const ReportController = require('./report.controller');

const router = express.Router();

// JSON endpoints
router.get('/student/:studentId', ReportController.generateStudentReport);
router.get('/class/:streamId', ReportController.generateClassReport);
router.get('/ranking/:streamId', ReportController.generateRankingReport);

// PDF download endpoints
router.get('/student/:studentId/pdf', ReportController.downloadStudentPdf);
router.get('/class/:streamId/pdf', ReportController.downloadClassPdf);

module.exports = router;
