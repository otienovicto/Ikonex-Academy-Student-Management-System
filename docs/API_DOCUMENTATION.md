# API Documentation

## Student Management System API

### Base URL
```
http://localhost:5000/api
```

## Endpoints

### Students
- `GET /students` - Get all students
- `GET /students/:id` - Get a student by ID
- `POST /students` - Create a new student
- `PUT /students/:id` - Update a student
- `DELETE /students/:id` - Delete a student

### Streams
- `GET /streams` - Get all streams
- `GET /streams/:id` - Get a stream by ID
- `POST /streams` - Create a new stream
- `PUT /streams/:id` - Update a stream
- `DELETE /streams/:id` - Delete a stream

### Subjects
- `GET /subjects` - Get all subjects
- `GET /subjects/:id` - Get a subject by ID
- `POST /subjects` - Create a new subject
- `PUT /subjects/:id` - Update a subject
- `DELETE /subjects/:id` - Delete a subject

### Scores
- `GET /scores` - Get all scores
- `GET /scores/:id` - Get a score by ID
- `POST /scores` - Create a new score
- `PUT /scores/:id` - Update a score
- `DELETE /scores/:id` - Delete a score

### Reports
- `GET /reports/student/:studentId` - Generate student report
- `GET /reports/class/:streamId` - Generate class report
- `GET /reports/ranking/:streamId` - Generate ranking report
