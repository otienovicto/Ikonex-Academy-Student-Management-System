// Student Routes
const express = require('express');
const StudentController = require('./student.controller');
const validateRequest = require('../../middlewares/validate.middleware');
const StudentValidation = require('./student.validation');

const router = express.Router();

router.get('/', StudentController.getAllStudents);
router.get('/stream/:streamId', StudentController.getStudentsByStream);
router.get('/:id', StudentController.getStudentById);
router.post('/', validateRequest(StudentValidation.createSchema), StudentController.createStudent);
router.put('/:id', validateRequest(StudentValidation.updateSchema), StudentController.updateStudent);
router.delete('/:id', StudentController.deleteStudent);

module.exports = router;
