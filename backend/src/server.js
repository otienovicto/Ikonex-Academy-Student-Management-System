require('dotenv').config();
const app = require('./app');
const logger = require('./config/logger');
const { PORT } = require('./config/env');

// Ensure Render compatibility (fallback to process.env.PORT)
const port = PORT || process.env.PORT || 5000;

const server = app.listen(port, () => {
  logger.info(`Server started on port ${port}`);
  console.log(`Server running on port ${port}`);
});

// Graceful Shutdown (Production Safe)
const shutdown = (signal) => {
  logger.info(`${signal} received: closing HTTP server`);

  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });

  // Force shutdown if hanging connections exist
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
