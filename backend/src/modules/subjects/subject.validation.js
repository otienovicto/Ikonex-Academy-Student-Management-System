// Subject Validation
const Joi = require('joi');

const SubjectValidation = {
  createSchema: Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
      'string.empty': 'Subject name is required',
      'string.min': 'Subject name must be at least 2 characters',
      'string.max': 'Subject name cannot exceed 100 characters',
    }),
    code: Joi.string().min(2).max(20).required().messages({
      'string.empty': 'Subject code is required',
      'string.min': 'Subject code must be at least 2 characters',
      'string.max': 'Subject code cannot exceed 20 characters',
    }),
    streamIds: Joi.array().items(Joi.number().integer()).optional(),
  }).unknown(true),

  updateSchema: Joi.object({
    name: Joi.string().min(2).max(100).messages({
      'string.min': 'Subject name must be at least 2 characters',
      'string.max': 'Subject name cannot exceed 100 characters',
    }),
    code: Joi.string().min(2).max(20).messages({
      'string.min': 'Subject code must be at least 2 characters',
      'string.max': 'Subject code cannot exceed 20 characters',
    }),
  }).unknown(false).min(1).messages({
    'object.min': 'At least one field must be provided for update',
  }),

  assignStreamSchema: Joi.object({
    streamId: Joi.number().integer().required().messages({
      'number.base': 'Stream ID must be a number',
      'any.required': 'Stream ID is required',
    }),
  }).unknown(false),
};

module.exports = SubjectValidation;
