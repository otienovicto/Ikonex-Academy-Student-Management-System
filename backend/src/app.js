// Express App Configuration
const express = require('express');
const cors = require('cors');
const errorMiddleware = require('./middlewares/error.middleware');
const studentRoutes = require('./modules/students/student.routes');
const streamRoutes = require('./modules/streams/stream.routes');
const subjectRoutes = require('./modules/subjects/subject.routes');
const scoreRoutes = require('./modules/assessments/score.routes');
const resultsRoutes = require('./modules/results/results.routes');
const reportRoutes = require('./modules/reports/report.routes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/streams', streamRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/results', resultsRoutes);
app.use('/api/reports', reportRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

// Error Middleware
app.use(errorMiddleware);

module.exports = app;
