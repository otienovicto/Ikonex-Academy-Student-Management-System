// Server Entry Point
require('dotenv').config();
const app = require('./app');
const logger = require('./config/logger');
const { PORT } = require('./config/env');

const server = app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});
