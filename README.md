# Student Management System

A comprehensive web-based student management system built with Node.js/Express and Next.js/React.

## Features

- **Student Management**: Add, update, and manage student information
- **Stream Management**: Organize students into academic streams
- **Subject Management**: Create and manage subjects for different streams
- **Assessment Scoring**: Record and track student scores for various assessments
- **Report Generation**: Generate detailed reports including:
  - Individual student performance reports
  - Class-wide statistical reports
  - Student ranking reports
- **Grade Calculation**: Automatic grade calculation based on marks
- **Authentication**: JWT-based authentication for secure access

## System Architecture

### Backend (Node.js/Express)
- RESTful API endpoints
- PostgreSQL database with native `pg` driver
- Input validation with Joi
- JWT authentication
- Comprehensive error handling

### Frontend (Next.js/React)
- Modern React components
- Server-side rendering with Next.js
- API integration with Axios
- React hooks for state management
- Context API for global state
- Responsive design

## Prerequisites

- Node.js v14 or higher
- PostgreSQL 12 or higher
- npm or yarn package manager
- Docker and Docker Compose (optional)

## Installation

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Update backend/.env with your database credentials if needed
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Database Setup

### Create the database manually

```bash
psql -U postgres -c "CREATE DATABASE student_management;"
```

### Run schema scripts

```bash
psql -U postgres -d student_management -f database/schema.sql
```

### Seed sample data

```bash
psql -U postgres -d student_management -f database/seed.sql
```

### Verify backend PostgreSQL connection

```bash
cd backend
npm run db:check
```

### Database model overview

- `class_streams` stores streams/classes
- `students` belongs to one stream via `stream_id`
- `subjects` stores academic subjects
- `stream_subjects` is a many-to-many join between streams and subjects
- `assessments` stores student scores with a unique constraint on (`student_id`, `subject_id`)

## Running the Application

### Development

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Production

```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run build
npm start
```

### Docker

```bash
docker-compose up
```

## API Endpoints

### Students
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Streams
- `GET /api/streams` - Get all streams
- `GET /api/streams/:id` - Get stream by ID
- `POST /api/streams` - Create new stream
- `PUT /api/streams/:id` - Update stream
- `DELETE /api/streams/:id` - Delete stream

### Subjects
- `GET /api/subjects` - Get all subjects
- `GET /api/subjects/:id` - Get subject by ID
- `POST /api/subjects` - Create new subject
- `PUT /api/subjects/:id` - Update subject
- `DELETE /api/subjects/:id` - Delete subject

### Scores
- `GET /api/scores` - Get all scores
- `GET /api/scores/:id` - Get score by ID
- `POST /api/scores` - Create new score
- `PUT /api/scores/:id` - Update score
- `DELETE /api/scores/:id` - Delete score

### Reports
- `GET /api/reports/student/:studentId` - Student report
- `GET /api/reports/class/:streamId` - Class report
- `GET /api/reports/ranking/:streamId` - Ranking report

## Project Structure

```
student-management-system/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── modules/
│   │   ├── middlewares/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/
│   ├── package.json
│   ├── .env
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── context/
│   ├── public/
│   ├── package.json
│   └── next.config.js
├── docs/
├── database/
├── scripts/
├── docker-compose.yml
├── .gitignore
└── README.md
```

## Documentation

- [API Documentation](docs/API_DOCUMENTATION.md)
- [System Design](docs/SYSTEM_DESIGN.md)
- [Database Schema](docs/DATABASE_SCHEMA.md)
- [Deployment Guide](docs/DEPLOYMENT_GUIDE.md)
- [User Manual](docs/USER_MANUAL.md)

## Environment Variables

### Backend
```
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/student_management
JWT_SECRET=your_jwt_secret_key_here
API_URL=http://localhost:5000
```

### Frontend
```
API_URL=http://localhost:5000
```

## Database

The system uses PostgreSQL as the primary database with the following entities:
- Class streams
- Students
- Subjects
- Assessments

## Grade Scale

- A: 90-100
- B: 80-89
- C: 70-79
- D: 60-69
- E: 50-59
- F: Below 50

## License

ISC

## Support

For issues, questions, or contributions, please create an issue or pull request in the repository.
