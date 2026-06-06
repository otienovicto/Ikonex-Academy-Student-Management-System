// Subject Routes
const express = require('express');
const SubjectController = require('./subject.controller');
const validateRequest = require('../../middlewares/validate.middleware');
const SubjectValidation = require('./subject.validation');

const router = express.Router();

router.get('/', SubjectController.getAllSubjects);
router.post('/', validateRequest(SubjectValidation.createSchema), SubjectController.createSubject);
router.get('/stream/:streamId', SubjectController.getSubjectsByStream);
router.get('/:id', SubjectController.getSubjectById);
router.put('/:id', validateRequest(SubjectValidation.updateSchema), SubjectController.updateSubject);
router.post(
  '/:id/streams',
  validateRequest(SubjectValidation.assignStreamSchema),
  SubjectController.assignSubjectToStream
);
router.delete('/:id/streams/:streamId', SubjectController.removeSubjectFromStream);
router.delete('/:id', SubjectController.deleteSubject);

module.exports = router;
