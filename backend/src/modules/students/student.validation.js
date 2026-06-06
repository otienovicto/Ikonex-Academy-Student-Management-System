// Student Validation
const Joi = require('joi');

const StudentValidation = {
  createSchema: Joi.object({
    registrationNumber: Joi.string()
      .trim()
      .min(3)
      .max(50)
      .required()
      .messages({
        'string.empty': 'Registration number is required',
        'string.min': 'Registration number must be at least 3 characters',
        'string.max': 'Registration number must not exceed 50 characters',
      }),
    firstName: Joi.string()
      .trim()
      .min(2)
      .max(100)
      .required()
      .messages({
        'string.empty': 'First name is required',
        'string.min': 'First name must be at least 2 characters',
        'string.max': 'First name must not exceed 100 characters',
      }),
    lastName: Joi.string()
      .trim()
      .min(2)
      .max(100)
      .required()
      .messages({
        'string.empty': 'Last name is required',
        'string.min': 'Last name must be at least 2 characters',
        'string.max': 'Last name must not exceed 100 characters',
      }),
    email: Joi.string()
      .trim()
      .email()
      .required()
      .messages({
        'string.email': 'Email must be a valid email address',
        'string.empty': 'Email is required',
      }),
    dateOfBirth: Joi.date()
      .required()
      .messages({
        'any.required': 'Date of birth is required',
      }),
    streamId: Joi.number()
      .integer()
      .required()
      .messages({
        'number.base': 'Stream ID must be a number',
        'any.required': 'Stream ID is required',
      }),
  }).unknown(false),

  updateSchema: Joi.object({
    registrationNumber: Joi.string()
      .trim()
      .min(3)
      .max(50)
      .messages({
        'string.min': 'Registration number must be at least 3 characters',
        'string.max': 'Registration number must not exceed 50 characters',
      }),
    firstName: Joi.string()
      .trim()
      .min(2)
      .max(100)
      .messages({
        'string.min': 'First name must be at least 2 characters',
        'string.max': 'First name must not exceed 100 characters',
      }),
    lastName: Joi.string()
      .trim()
      .min(2)
      .max(100)
      .messages({
        'string.min': 'Last name must be at least 2 characters',
        'string.max': 'Last name must not exceed 100 characters',
      }),
    email: Joi.string()
      .trim()
      .email()
      .messages({
        'string.email': 'Email must be a valid email address',
      }),
    dateOfBirth: Joi.date(),
    streamId: Joi.number()
      .integer()
      .messages({
        'number.base': 'Stream ID must be a number',
      }),
  }).unknown(false).min(1),
};

module.exports = StudentValidation;
