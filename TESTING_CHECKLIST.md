# Phase 11: Integration and Testing Checklist

## Backend Base URL
- **API Endpoint**: `http://localhost:5000/api`
- **Frontend**: `http://localhost:3001`

---

## 1. STREAM MANAGEMENT - Implemented ✅

### Endpoints
- `POST /api/streams` - Create stream
- `GET /api/streams` - Get all streams with nested data
- `GET /api/streams/:id` - Get stream details
- `PUT /api/streams/:id` - Update stream
- `DELETE /api/streams/:id` - Delete stream

### Test Data
```bash
# Create Form 1A
curl -X POST http://localhost:5000/api/streams \
  -H "Content-Type: application/json" \
  -d '{"name":"Form 1A","code":"F1A","description":"Form One A Stream"}'

# Create Form 1B
curl -X POST http://localhost:5000/api/streams \
  -H "Content-Type: application/json" \
  -d '{"name":"Form 1B","code":"F1B","description":"Form One B Stream"}'

# Create Form 1C
curl -X POST http://localhost:5000/api/streams \
  -H "Content-Type: application/json" \
  -d '{"name":"Form 1C","code":"F1C","description":"Form One C Stream"}'
```

### Frontend
- Page: `http://localhost:3001/streams`
- Features: Add, Edit, Delete, View all

---

## 2. STUDENT MANAGEMENT - Implemented ✅

### Endpoints
- `POST /api/students` - Create student & assign to stream
- `GET /api/students` - Get all students with nested stream
- `GET /api/students/:id` - Get single student details
- `GET /api/students/stream/:streamId` - Get students by stream
- `PUT /api/students/:id` - Edit student
- `DELETE /api/students/:id` - Delete student

### Test Data
```bash
# Register Student 1 (Form 1A)
curl -X POST http://localhost:5000/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "registrationNumber":"STU001",
    "firstName":"Alice",
    "lastName":"Johnson",
    "email":"alice@school.com",
    "dateOfBirth":"2008-03-15",
    "streamId":1
  }'

# Register Student 2 (Form 1A)
curl -X POST http://localhost:5000/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "registrationNumber":"STU002",
    "firstName":"Bob",
    "lastName":"Smith",
    "email":"bob@school.com",
    "dateOfBirth":"2008-05-22",
    "streamId":1
  }'

# Register Student 3 (Form 1B)
curl -X POST http://localhost:5000/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "registrationNumber":"STU003",
    "firstName":"Charlie",
    "lastName":"Brown",
    "email":"charlie@school.com",
    "dateOfBirth":"2008-07-10",
    "streamId":2
  }'
```

### Validation
- [ ] Registration number is unique
- [ ] Email is valid format
- [ ] Date of birth is before today
- [ ] Stream must exist
- [ ] Cannot register duplicate

### Frontend
- Page: `http://localhost:3001/students`
- Features: Add, Edit, Delete, View all, Filter by stream

---

## 3. SUBJECT MANAGEMENT - Implemented ✅

### Endpoints
- `POST /api/subjects` - Create subject
- `GET /api/subjects` - Get all subjects
- `GET /api/subjects/:id` - Get subject details
- `PUT /api/subjects/:id` - Update subject
- `DELETE /api/subjects/:id` - Delete subject
- `POST /api/subjects/:id/assign-stream` - Assign to stream
- `GET /api/subjects/stream/:streamId` - Get subjects by stream

### Test Data
```bash
# Create Mathematics
curl -X POST http://localhost:5000/api/subjects \
  -H "Content-Type: application/json" \
  -d '{"name":"Mathematics","code":"MATH"}'

# Create English
curl -X POST http://localhost:5000/api/subjects \
  -H "Content-Type: application/json" \
  -d '{"name":"English Language","code":"ENG"}'

# Create Science
curl -X POST http://localhost:5000/api/subjects \
  -H "Content-Type: application/json" \
  -d '{"name":"Science","code":"SCI"}'

# Assign Math to Form 1A (subject_id=1, stream_id=1)
curl -X POST http://localhost:5000/api/subjects/1/assign-stream \
  -H "Content-Type: application/json" \
  -d '{"streamId":1}'

# Assign Math to Form 1B
curl -X POST http://localhost:5000/api/subjects/1/assign-stream \
  -H "Content-Type: application/json" \
  -d '{"streamId":2}'

# Assign English to Form 1A
curl -X POST http://localhost:5000/api/subjects/2/assign-stream \
  -H "Content-Type: application/json" \
  -d '{"streamId":1}'

# Assign Science to Form 1A
curl -X POST http://localhost:5000/api/subjects/3/assign-stream \
  -H "Content-Type: application/json" \
  -d '{"streamId":1}'
```

### Frontend
- Page: `http://localhost:3001/subjects`
- Features: Add, Edit, Delete, Assign to streams, View all

---

## 4. STUDENT ASSESSMENT & SCORING - Implemented ✅

### Endpoints
- `POST /api/scores` - Record score (prevents duplicates via UNIQUE constraint)
- `GET /api/scores` - Get all scores
- `GET /api/scores/:id` - Get score details
- `PUT /api/scores/:id` - Update score
- `DELETE /api/scores/:id` - Delete score
- `GET /api/scores/student/:studentId` - Student performance by subject
- `GET /api/scores/subject/:subjectId` - Subject performance
- `GET /api/scores/student/:studentId/aggregates` - Student totals
- `GET /api/scores/subject/:subjectId/aggregates` - Subject averages
- `GET /api/scores/student/:studentId/subject/:subjectId` - Specific score

### Test Data
```bash
# Record score for Alice in Mathematics
curl -X POST http://localhost:5000/api/scores \
  -H "Content-Type: application/json" \
  -d '{
    "studentId":1,
    "subjectId":1,
    "assessmentName":"Midterm Exam",
    "assessmentType":"Exam",
    "marks":87.5
  }'

# Record score for Alice in English
curl -X POST http://localhost:5000/api/scores \
  -H "Content-Type: application/json" \
  -d '{
    "studentId":1,
    "subjectId":2,
    "assessmentName":"Midterm Exam",
    "assessmentType":"Exam",
    "marks":92.0
  }'

# Record score for Bob in Mathematics
curl -X POST http://localhost:5000/api/scores \
  -H "Content-Type: application/json" \
  -d '{
    "studentId":2,
    "subjectId":1,
    "assessmentName":"Midterm Exam",
    "assessmentType":"Exam",
    "marks":78.5
  }'

# Record score for Charlie in Mathematics
curl -X POST http://localhost:5000/api/scores \
  -H "Content-Type: application/json" \
  -d '{
    "studentId":3,
    "subjectId":1,
    "assessmentName":"Midterm Exam",
    "assessmentType":"Exam",
    "marks":95.0
  }'
```

### Validation
- [ ] Marks between 0-100
- [ ] Cannot have duplicate (same student+subject)
- [ ] Student must exist
- [ ] Subject must exist
- [ ] Assessment type: Exam, Quiz, Assignment, CA

### Frontend
- Page: `http://localhost:3001/scores`
- Features: Record, Edit, Delete, View all, Duplicate prevention

---

## 5. RESULTS PROCESSING - Implemented ✅

### Endpoints
- `GET /api/results/class/:streamId` - Class rankings with grades
- `GET /api/results/subject/:subjectId` - Subject rankings
- `GET /api/results/student/:studentId` - Student overall performance

### Calculation Rules
- **Grade Scale** (A-E):
  - A: >= 90 (GPA: 4.0)
  - B: >= 80 (GPA: 3.0)
  - C: >= 70 (GPA: 2.0)
  - D: >= 60 (GPA: 1.0)
  - E: < 60 (GPA: 0.0)

- **Ranking**: Dense ranking (ties get same position, no skips)
  - Alice (92.33 avg) = Position 1
  - Bob (78.5 avg) = Position 2
  - Charlie (95.0 avg) = Position 1 (tied with higher avg? needs correction)

### Test Queries
```bash
# Get Form 1A class rankings
curl http://localhost:5000/api/results/class/1

# Get Math subject rankings
curl http://localhost:5000/api/results/subject/1

# Get Alice's overall performance
curl http://localhost:5000/api/results/student/1

# Expected Response Format
{
  "success": true,
  "data": {
    "rankings": [
      {
        "studentId": 1,
        "firstName": "Alice",
        "lastName": "Johnson",
        "average": 89.75,
        "grade": "A",
        "gpa": 4.0,
        "position": 1
      }
    ]
  }
}
```

### Validation
- [ ] Average calculated correctly
- [ ] Grade assigned based on scale
- [ ] GPA mapped correctly
- [ ] Ranking is dense (no gaps)
- [ ] Ties handled properly

---

## 6. REPORTING - Implemented ✅

### Endpoints
- `GET /api/reports/student/:studentId` - Student report JSON
- `GET /api/reports/class/:streamId` - Class report JSON
- `GET /api/reports/ranking/:streamId` - Ranking report JSON
- `GET /api/reports/student/:studentId/pdf` - Download student PDF
- `GET /api/reports/class/:streamId/pdf` - Download class PDF

### Test Queries
```bash
# Get student report
curl http://localhost:5000/api/reports/student/1

# Download student PDF
curl http://localhost:5000/api/reports/student/1/pdf \
  -o student_report_1.pdf

# Get class report
curl http://localhost:5000/api/reports/class/1

# Download class PDF
curl http://localhost:5000/api/reports/class/1/pdf \
  -o class_report_1.pdf
```

### PDF Content Validation
- [ ] Student name and registration number
- [ ] All subjects and marks
- [ ] Overall average and grade
- [ ] Class rank
- [ ] Subject ranks
- [ ] Date generated
- [ ] School header/footer

### Frontend
- Page: `http://localhost:3001/reports`
- Features: Generate, Download PDF, View HTML

---

## Integration Test Flow

### Sequential Steps to Validate End-to-End

1. **Setup Streams** → Create 3 streams (Form 1A, 1B, 1C)
2. **Register Students** → Add 5-10 students across streams
3. **Create Subjects** → Add 5-6 subjects (Math, English, Science, etc.)
4. **Assign Subjects to Streams** → Map subjects to each stream
5. **Record Scores** → Add marks for all students in all subjects
6. **Verify Results** → Check calculations, rankings, grades
7. **Generate Reports** → Create student and class reports
8. **Test PDFs** → Download and validate PDF generation
9. **Frontend Validation** → Test UI on all pages

---

## Known Issues to Monitor

- [ ] Stream deletion cascades to students (should prevent if students exist)
- [ ] Subject deletion from stream (should allow reassignment)
- [ ] Score duplication prevention (UNIQUE constraint should catch)
- [ ] Date validation on student DOB
- [ ] PDF generation requires Puppeteer (may not be installed)

---

## Backend Health Check

```bash
# Quick health check
curl http://localhost:5000/api/health

# Expected Response
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2025-06-06T10:30:00Z"
  }
}
```

---

## Frontend Health Check

- Navigate to `http://localhost:3001`
- Verify: Dashboard, Navbar (profile icon), Sidebar menu loads
- Check console for errors (F12)
- Verify API calls in Network tab

---

## Endpoint Summary Table

| Module | Method | Endpoint | Status |
|--------|--------|----------|--------|
| Streams | POST | /api/streams | ✅ |
| Streams | GET | /api/streams | ✅ |
| Streams | GET | /api/streams/:id | ✅ |
| Streams | PUT | /api/streams/:id | ✅ |
| Streams | DELETE | /api/streams/:id | ✅ |
| Students | POST | /api/students | ✅ |
| Students | GET | /api/students | ✅ |
| Students | GET | /api/students/:id | ✅ |
| Students | GET | /api/students/stream/:streamId | ✅ |
| Students | PUT | /api/students/:id | ✅ |
| Students | DELETE | /api/students/:id | ✅ |
| Subjects | POST | /api/subjects | ✅ |
| Subjects | GET | /api/subjects | ✅ |
| Subjects | GET | /api/subjects/:id | ✅ |
| Subjects | PUT | /api/subjects/:id | ✅ |
| Subjects | DELETE | /api/subjects/:id | ✅ |
| Subjects | GET | /api/subjects/stream/:streamId | ✅ |
| Subjects | POST | /api/subjects/:id/assign-stream | ✅ |
| Scores | POST | /api/scores | ✅ |
| Scores | GET | /api/scores | ✅ |
| Scores | GET | /api/scores/:id | ✅ |
| Scores | PUT | /api/scores/:id | ✅ |
| Scores | DELETE | /api/scores/:id | ✅ |
| Scores | GET | /api/scores/student/:studentId | ✅ |
| Scores | GET | /api/scores/subject/:subjectId | ✅ |
| Results | GET | /api/results/class/:streamId | ✅ |
| Results | GET | /api/results/subject/:subjectId | ✅ |
| Results | GET | /api/results/student/:studentId | ✅ |
| Reports | GET | /api/reports/student/:studentId | ✅ |
| Reports | GET | /api/reports/class/:streamId | ✅ |
| Reports | GET | /api/reports/student/:studentId/pdf | ✅ |
| Reports | GET | /api/reports/class/:streamId/pdf | ✅ |

