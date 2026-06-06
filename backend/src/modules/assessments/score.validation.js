// Score Validation
const Joi = require('joi');

const ScoreValidation = {
  createSchema: Joi.object({
    studentId: Joi.number().integer().required().messages({
      'number.base': 'Student ID must be a number',
      'any.required': 'Student ID is required',
    }),
    subjectId: Joi.number().integer().required().messages({
      'number.base': 'Subject ID must be a number',
      'any.required': 'Subject ID is required',
    }),
    marks: Joi.number().min(0).max(100).required().messages({
      'number.base': 'Marks must be a number',
      'number.min': 'Marks must be at least 0',
      'number.max': 'Marks cannot exceed 100',
      'any.required': 'Marks are required',
    }),
    assessmentType: Joi.string()
      .valid('test', 'assignment', 'exam')
      .required()
      .messages({
        'any.only': 'Assessment type must be one of: test, assignment, exam',
        'string.empty': 'Assessment type is required',
        'any.required': 'Assessment type is required',
      }),
  }).unknown(false),

  updateSchema: Joi.object({
    marks: Joi.number().min(0).max(100).messages({
      'number.base': 'Marks must be a number',
      'number.min': 'Marks must be at least 0',
      'number.max': 'Marks cannot exceed 100',
    }),
    assessmentType: Joi.string()
      .valid('test', 'assignment', 'exam')
      .messages({
        'any.only': 'Assessment type must be one of: test, assignment, exam',
      }),
  }).unknown(false).min(1).messages({
    'object.min': 'At least one field must be provided for update',
  }),
};

module.exports = ScoreValidation;
