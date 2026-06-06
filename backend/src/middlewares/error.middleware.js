// Error Middleware
const logger = require('../config/logger');
const ResponseFormatter = require('../utils/responseFormatter');

const errorMiddleware = (err, req, res, next) => {
  logger.error('Error occurred', err);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json(ResponseFormatter.error(
    message,
    process.env.NODE_ENV === 'development' ? err : null
  ));
};

module.exports = errorMiddleware;
