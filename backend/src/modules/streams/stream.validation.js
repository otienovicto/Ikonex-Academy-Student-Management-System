// Stream Validation
const Joi = require('joi');

const StreamValidation = {
  createSchema: Joi.object({
    name: Joi.string().trim().min(2).max(100).required().messages({
      'string.empty': 'Stream name is required',
      'string.min': 'Stream name must be at least 2 characters',
      'string.max': 'Stream name must not exceed 100 characters',
    }),
    code: Joi.string().trim().min(2).max(20).required().uppercase().messages({
      'string.empty': 'Stream code is required',
      'string.min': 'Stream code must be at least 2 characters',
      'string.max': 'Stream code must not exceed 20 characters',
    }),
    description: Joi.string().trim().max(500).allow(null, '').messages({
      'string.max': 'Description must not exceed 500 characters',
    }),
  }).unknown(false),

  updateSchema: Joi.object({
    name: Joi.string().trim().min(2).max(100).messages({
      'string.min': 'Stream name must be at least 2 characters',
      'string.max': 'Stream name must not exceed 100 characters',
    }),
    code: Joi.string().trim().min(2).max(20).uppercase().messages({
      'string.min': 'Stream code must be at least 2 characters',
      'string.max': 'Stream code must not exceed 20 characters',
    }),
    description: Joi.string().trim().max(500).allow(null, '').messages({
      'string.max': 'Description must not exceed 500 characters',
    }),
  }).unknown(false).min(1),
};

module.exports = StreamValidation;
