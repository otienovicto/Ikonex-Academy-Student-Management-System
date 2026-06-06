// Validation Middleware
const ResponseFormatter = require('../utils/responseFormatter');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);

    if (error) {
      return res.status(400).json(ResponseFormatter.error(
        'Validation error',
        error.details.map((detail) => detail.message)
      ));
    }

    req.body = value;
    next();
  };
};

module.exports = validateRequest;
