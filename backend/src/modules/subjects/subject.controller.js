// Subject Controller
const asyncHandler = require('../../utils/asyncHandler');
const ResponseFormatter = require('../../utils/responseFormatter');
const SubjectService = require('./subject.service');

const SubjectController = {
  getAllSubjects: asyncHandler(async (req, res) => {
    const subjects = await SubjectService.getAllSubjects();
    res.status(200).json(ResponseFormatter.success(subjects));
  }),

  getSubjectById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const subject = await SubjectService.getSubjectById(id);
    if (!subject) {
      return res.status(404).json(ResponseFormatter.error('Subject not found'));
    }
    res.status(200).json(ResponseFormatter.success(subject));
  }),

  createSubject: asyncHandler(async (req, res) => {
    const subject = await SubjectService.createSubject(req.body);
    res.status(201).json(ResponseFormatter.success(subject, 'Subject created successfully'));
  }),

  updateSubject: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const subject = await SubjectService.updateSubject(id, req.body);
    if (!subject) {
      return res.status(404).json(ResponseFormatter.error('Subject not found'));
    }
    res.status(200).json(ResponseFormatter.success(subject, 'Subject updated successfully'));
  }),

  deleteSubject: asyncHandler(async (req, res) => {
    await SubjectService.deleteSubject(req.params.id);
    res.status(200).json(ResponseFormatter.success(null, 'Subject deleted successfully'));
  }),

  getSubjectsByStream: asyncHandler(async (req, res) => {
    const { streamId } = req.params;
    const subjects = await SubjectService.getSubjectsByStream(streamId);
    res.status(200).json(ResponseFormatter.success(subjects));
  }),

  assignSubjectToStream: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { streamId } = req.body;
    await SubjectService.assignSubjectToStream(id, streamId);
    const subject = await SubjectService.getSubjectById(id);
    res.status(201).json(
      ResponseFormatter.success(subject, 'Subject assigned to stream successfully')
    );
  }),

  removeSubjectFromStream: asyncHandler(async (req, res) => {
    const { id, streamId } = req.params;
    await SubjectService.removeSubjectFromStream(id, streamId);
    res.status(200).json(ResponseFormatter.success(null, 'Subject removed from stream successfully'));
  }),
};

module.exports = SubjectController;
