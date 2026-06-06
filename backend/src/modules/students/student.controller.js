// Student Controller
const asyncHandler = require('../../utils/asyncHandler');
const ResponseFormatter = require('../../utils/responseFormatter');
const StudentService = require('./student.service');

const StudentController = {
  getAllStudents: asyncHandler(async (req, res) => {
    const students = await StudentService.getAllStudents();
    res.status(200).json(ResponseFormatter.success(students));
  }),

  getStudentById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const student = await StudentService.getStudentById(id);
    if (!student) {
      return res.status(404).json(ResponseFormatter.error('Student not found'));
    }
    res.status(200).json(ResponseFormatter.success(student));
  }),

  getStudentsByStream: asyncHandler(async (req, res) => {
    const { streamId } = req.params;
    const students = await StudentService.getStudentsByStream(streamId);
    res.status(200).json(ResponseFormatter.success(students, `Students from stream ${streamId}`));
  }),

  createStudent: asyncHandler(async (req, res) => {
    const student = await StudentService.createStudent(req.body);
    res.status(201).json(ResponseFormatter.success(student, 'Student registered successfully'));
  }),

  updateStudent: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const student = await StudentService.updateStudent(id, req.body);
    if (!student) {
      return res.status(404).json(ResponseFormatter.error('Student not found'));
    }
    res.status(200).json(ResponseFormatter.success(student, 'Student updated successfully'));
  }),

  deleteStudent: asyncHandler(async (req, res) => {
    await StudentService.deleteStudent(req.params.id);
    res.status(200).json(ResponseFormatter.success(null, 'Student deleted successfully'));
  }),
};

module.exports = StudentController;
