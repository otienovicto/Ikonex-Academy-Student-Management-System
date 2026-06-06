// Report Controller
const asyncHandler = require('../../utils/asyncHandler');
const ResponseFormatter = require('../../utils/responseFormatter');
const ReportService = require('./report.service');
const PdfGenerator = require('./pdf.generator');

const ReportController = {
  generateStudentReport: asyncHandler(async (req, res) => {
    const { studentId } = req.params;
    const report = await ReportService.generateStudentReport(studentId);
    res.status(200).json(ResponseFormatter.success(report));
  }),

  generateClassReport: asyncHandler(async (req, res) => {
    const { streamId } = req.params;
    const report = await ReportService.generateClassReport(streamId);
    res.status(200).json(ResponseFormatter.success(report));
  }),

  generateRankingReport: asyncHandler(async (req, res) => {
    const { streamId } = req.params;
    const report = await ReportService.generateRankingReport(streamId);
    res.status(200).json(ResponseFormatter.success(report));
  }),

  downloadStudentPdf: asyncHandler(async (req, res) => {
    const { studentId } = req.params;
    const report = await ReportService.generateStudentReport(studentId);
    const pdf = await PdfGenerator.generateStudentPdf(report);
    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="report_${studentId}.pdf"` });
    res.status(200).send(pdf);
  }),

  downloadClassPdf: asyncHandler(async (req, res) => {
    const { streamId } = req.params;
    const report = await ReportService.generateClassReport(streamId);
    const pdf = await PdfGenerator.generateClassPdf(report);
    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="class_report_${streamId}.pdf"` });
    res.status(200).send(pdf);
  }),
};

module.exports = ReportController;
