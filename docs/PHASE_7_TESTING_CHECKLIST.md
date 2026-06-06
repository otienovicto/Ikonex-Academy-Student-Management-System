# Phase 7: Assessment & Scoring System - Testing Checklist

## Manual Testing Guidelines

Use Postman or curl to test all endpoints. Ensure PostgreSQL is running and the backend is started with `npm run dev`.

---

## Test Cases

### Section 1: Score Entry & Validation

#### Test 1.1: Create Score (Valid Data)
- **Method:** POST `/api/scores`
- **Request:**
  ```json
  {
    "studentId": 1,
    "subjectId": 1,
    "marks": 85,
    "assessmentType": "exam"
  }
  ```
- **Expected Status:** 201 Created
- **Verify:**
  - Response includes score ID
  - `marks` stored correctly as 85
  - `assessmentType` is "exam"
  - Student and subject details included
  - `created_at` and `updated_at` set

#### Test 1.2: Create Score (With Decimal Marks)
- **Method:** POST `/api/scores`
- **Request:**
  ```json
  {
    "studentId": 2,
    "subjectId": 2,
    "marks": 92.5,
    "assessmentType": "test"
  }
  ```
- **Expected Status:** 201 Created
- **Verify:**
  - Decimal marks stored correctly
  - Type "test" accepted

#### Test 1.3: Create Score (Marks = 0)
- **Method:** POST `/api/scores`
- **Request:**
  ```json
  {
    "studentId": 3,
    "subjectId": 1,
    "marks": 0,
    "assessmentType": "assignment"
  }
  ```
- **Expected Status:** 201 Created
- **Verify:**
  - Zero marks accepted
  - Type "assignment" accepted

#### Test 1.4: Create Score (Marks = 100)
- **Method:** POST `/api/scores`
- **Request:**
  ```json
  {
    "studentId": 4,
    "subjectId": 3,
    "marks": 100,
    "assessmentType": "exam"
  }
  ```
- **Expected Status:** 201 Created
- **Verify:**
  - Maximum marks accepted

#### Test 1.5: Create Score (Marks < 0)
- **Method:** POST `/api/scores`
- **Request:**
  ```json
  {
    "studentId": 1,
    "subjectId": 2,
    "marks": -5,
    "assessmentType": "test"
  }
  ```
- **Expected Status:** 400 Bad Request
- **Verify:**
  - Error indicates marks must be at least 0

#### Test 1.6: Create Score (Marks > 100)
- **Method:** POST `/api/scores`
- **Request:**
  ```json
  {
    "studentId": 1,
    "subjectId": 2,
    "marks": 105,
    "assessmentType": "test"
  }
  ```
- **Expected Status:** 400 Bad Request
- **Verify:**
  - Error indicates marks cannot exceed 100

#### Test 1.7: Create Score (Invalid Assessment Type)
- **Method:** POST `/api/scores`
- **Request:**
  ```json
  {
    "studentId": 1,
    "subjectId": 2,
    "marks": 85,
    "assessmentType": "quiz"
  }
  ```
- **Expected Status:** 400 Bad Request
- **Verify:**
  - Error indicates type must be test, assignment, or exam

#### Test 1.8: Create Score (Missing Marks)
- **Method:** POST `/api/scores`
- **Request:**
  ```json
  {
    "studentId": 1,
    "subjectId": 2,
    "assessmentType": "test"
  }
  ```
- **Expected Status:** 400 Bad Request
- **Verify:**
  - Error indicates marks are required

#### Test 1.9: Create Score (Missing Assessment Type)
- **Method:** POST `/api/scores`
- **Request:**
  ```json
  {
    "studentId": 1,
    "subjectId": 2,
    "marks": 85
  }
  ```
- **Expected Status:** 400 Bad Request
- **Verify:**
  - Error indicates assessment type is required

#### Test 1.10: Create Score (Missing Student ID)
- **Method:** POST `/api/scores`
- **Request:**
  ```json
  {
    "subjectId": 1,
    "marks": 85,
    "assessmentType": "test"
  }
  ```
- **Expected Status:** 400 Bad Request
- **Verify:**
  - Error indicates student ID is required

#### Test 1.11: Create Score (Missing Subject ID)
- **Method:** POST `/api/scores`
- **Request:**
  ```json
  {
    "studentId": 1,
    "marks": 85,
    "assessmentType": "test"
  }
  ```
- **Expected Status:** 400 Bad Request
- **Verify:**
  - Error indicates subject ID is required

#### Test 1.12: Create Score (Invalid Student ID Type)
- **Method:** POST `/api/scores`
- **Request:**
  ```json
  {
    "studentId": "abc",
    "subjectId": 1,
    "marks": 85,
    "assessmentType": "test"
  }
  ```
- **Expected Status:** 400 Bad Request
- **Verify:**
  - Error indicates student ID must be a number

#### Test 1.13: Create Score (Unknown Fields)
- **Method:** POST `/api/scores`
- **Request:**
  ```json
  {
    "studentId": 1,
    "subjectId": 1,
    "marks": 85,
    "assessmentType": "test",
    "extraField": "should fail"
  }
  ```
- **Expected Status:** 400 Bad Request
- **Verify:**
  - Request rejected due to unknown field

#### Test 1.14: Create Score (Non-existent Student)
- **Method:** POST `/api/scores`
- **Request:**
  ```json
  {
    "studentId": 99999,
    "subjectId": 1,
    "marks": 85,
    "assessmentType": "test"
  }
  ```
- **Expected Status:** 400 or 404 (FK constraint)
- **Verify:**
  - Error indicates invalid student ID

#### Test 1.15: Create Score (Non-existent Subject)
- **Method:** POST `/api/scores`
- **Request:**
  ```json
  {
    "studentId": 1,
    "subjectId": 99999,
    "marks": 85,
    "assessmentType": "test"
  }
  ```
- **Expected Status:** 400 or 404 (FK constraint)
- **Verify:**
  - Error indicates invalid subject ID

---

### Section 2: Duplicate Prevention

#### Test 2.1: Create Duplicate Score (Same Student + Subject)
- **Prerequisites:** Score exists for student 1, subject 1
- **Method:** POST `/api/scores` (attempt to create second score for same student + subject)
- **Request:**
  ```json
  {
    "studentId": 1,
    "subjectId": 1,
    "marks": 90,
    "assessmentType": "test"
  }
  ```
- **Expected Status:** 409 Conflict
- **Expected Message:** "A score already exists for this student and subject combination"
- **Verify:**
  - Duplicate assignment prevented
  - Original score unchanged
  - Clear error message

#### Test 2.2: Create Multiple Scores (Same Student, Different Subjects)
- **Method:** POST `/api/scores` (multiple requests)
- **Request 1:**
  ```json
  {
    "studentId": 2,
    "subjectId": 1,
    "marks": 85,
    "assessmentType": "exam"
  }
  ```
- **Request 2:**
  ```json
  {
    "studentId": 2,
    "subjectId": 2,
    "marks": 92,
    "assessmentType": "test"
  }
  ```
- **Expected Status:** 201 for both
- **Verify:**
  - Same student can have scores in different subjects
  - Both scores created successfully

#### Test 2.3: Create Multiple Scores (Same Subject, Different Students)
- **Method:** POST `/api/scores` (multiple requests)
- **Request 1:**
  ```json
  {
    "studentId": 1,
    "subjectId": 2,
    "marks": 88,
    "assessmentType": "assignment"
  }
  ```
- **Request 2:**
  ```json
  {
    "studentId": 2,
    "subjectId": 2,
    "marks": 95,
    "assessmentType": "assignment"
  }
  ```
- **Expected Status:** 201 for both
- **Verify:**
  - Different students can have scores in same subject
  - Both scores created successfully

---

### Section 3: Score Update

#### Test 3.1: Update Score Marks
- **Method:** PUT `/api/scores/1`
- **Request:**
  ```json
  {
    "marks": 88
  }
  ```
- **Expected Status:** 200 OK
- **Verify:**
  - Marks updated
  - `updated_at` changed
  - `created_at` unchanged
  - Student/subject unchanged

#### Test 3.2: Update Score Assessment Type
- **Method:** PUT `/api/scores/1`
- **Request:**
  ```json
  {
    "assessmentType": "assignment"
  }
  ```
- **Expected Status:** 200 OK
- **Verify:**
  - Assessment type updated
  - Other fields unchanged

#### Test 3.3: Update Both Marks and Type
- **Method:** PUT `/api/scores/1`
- **Request:**
  ```json
  {
    "marks": 90,
    "assessmentType": "test"
  }
  ```
- **Expected Status:** 200 OK
- **Verify:**
  - Both fields updated
  - Response shows new values

#### Test 3.4: Update Score (Empty Request)
- **Method:** PUT `/api/scores/1`
- **Request:**
  ```json
  {}
  ```
- **Expected Status:** 400 Bad Request
- **Verify:**
  - Error indicates at least one field must be provided

#### Test 3.5: Update Score (Invalid Marks)
- **Method:** PUT `/api/scores/1`
- **Request:**
  ```json
  {
    "marks": 105
  }
  ```
- **Expected Status:** 400 Bad Request
- **Verify:**
  - Error indicates marks cannot exceed 100

#### Test 3.6: Update Score (Invalid Type)
- **Method:** PUT `/api/scores/1`
- **Request:**
  ```json
  {
    "assessmentType": "final"
  }
  ```
- **Expected Status:** 400 Bad Request
- **Verify:**
  - Error indicates invalid assessment type

#### Test 3.7: Update Score (Non-existent ID)
- **Method:** PUT `/api/scores/99999`
- **Request:**
  ```json
  {
    "marks": 85
  }
  ```
- **Expected Status:** 404 Not Found
- **Verify:**
  - Proper error response

#### Test 3.8: Verify Cannot Update Student ID
- **Method:** PUT `/api/scores/1`
- **Request:**
  ```json
  {
    "studentId": 2,
    "marks": 85
  }
  ```
- **Expected Status:** 200 OK (studentId ignored) OR 400 Bad Request
- **Verify:**
  - studentId cannot be changed (immutable)

#### Test 3.9: Verify Cannot Update Subject ID
- **Method:** PUT `/api/scores/1`
- **Request:**
  ```json
  {
    "subjectId": 2,
    "marks": 85
  }
  ```
- **Expected Status:** 200 OK (subjectId ignored) OR 400 Bad Request
- **Verify:**
  - subjectId cannot be changed (immutable)

---

### Section 4: Student Performance Queries

#### Test 4.1: Get Student Performance
- **Method:** GET `/api/scores/student/1`
- **Expected Status:** 200 OK
- **Verify:**
  - Returns student object with id, name, email
  - Returns array of scores with subject information
  - Scores ordered by subject name

#### Test 4.2: Get Student Performance (No Scores)
- **Method:** GET `/api/scores/student/5` (assuming no scores)
- **Expected Status:** 404 Not Found
- **Verify:**
  - Error indicates student not found or no scores

#### Test 4.3: Get Student Aggregates
- **Method:** GET `/api/scores/student/1/aggregates`
- **Expected Status:** 200 OK
- **Expected Response:**
  ```json
  {
    "student": { ... },
    "statistics": {
      "totalAssessments": 3,
      "averageMarks": "87.50",
      "minMarks": "82.00",
      "maxMarks": "92.00",
      "subjectsTaken": ["Mathematics", "Physics"]
    }
  }
  ```
- **Verify:**
  - totalAssessments counts correctly
  - averageMarks calculated correctly (GROUP BY)
  - minMarks and maxMarks accurate
  - subjectsTaken lists unique subjects

#### Test 4.4: Get Student Aggregates (Single Score)
- **Method:** GET `/api/scores/student/2/aggregates` (student with 1 score)
- **Verify:**
  - totalAssessments = 1
  - averageMarks = minMarks = maxMarks
  - subjectsTaken = [1 subject]

#### Test 4.5: Get Student Aggregates (No Scores)
- **Method:** GET `/api/scores/student/99999/aggregates`
- **Expected Status:** 404 Not Found
- **Verify:**
  - Error indicates student not found

---

### Section 5: Subject/Class Performance Queries

#### Test 5.1: Get Subject Performance
- **Method:** GET `/api/scores/subject/1`
- **Expected Status:** 200 OK
- **Verify:**
  - Returns subject object with name and code
  - Returns array of scores with student information
  - Scores ordered by student name

#### Test 5.2: Get Subject Performance (No Scores)
- **Method:** GET `/api/scores/subject/5` (assuming no scores)
- **Expected Status:** 404 Not Found
- **Verify:**
  - Error indicates subject not found or no scores

#### Test 5.3: Get Subject Aggregates (Class Statistics)
- **Method:** GET `/api/scores/subject/1/aggregates`
- **Expected Status:** 200 OK
- **Expected Response:**
  ```json
  {
    "subject": { ... },
    "statistics": {
      "totalScores": 5,
      "classAverage": "84.80",
      "minMarks": "75.00",
      "maxMarks": "95.00",
      "medianMarks": "85.00",
      "studentsAssessed": 5
    }
  }
  ```
- **Verify:**
  - totalScores = number of assessments
  - classAverage calculated correctly (GROUP BY)
  - minMarks and maxMarks correct
  - medianMarks calculated (PERCENTILE_CONT)
  - studentsAssessed = COUNT(DISTINCT student_id)

#### Test 5.4: Get Subject Aggregates (Single Score)
- **Method:** GET `/api/scores/subject/2/aggregates` (subject with 1 score)
- **Verify:**
  - totalScores = 1
  - classAverage = minMarks = maxMarks = medianMarks
  - studentsAssessed = 1

#### Test 5.5: Get Subject Aggregates (No Scores)
- **Method:** GET `/api/scores/subject/99999/aggregates`
- **Expected Status:** 404 Not Found
- **Verify:**
  - Error indicates subject not found

#### Test 5.6: Identify Top Performers in Subject
- **Method:** GET `/api/scores/subject/1`, manually review scores
- **Verify:**
  - Can identify highest scoring student
  - Can identify lowest scoring student
  - Can compare performance across students

---

### Section 6: Student-Subject Specific Performance

#### Test 6.1: Get Student-Subject Performance
- **Method:** GET `/api/scores/student/1/subject/1`
- **Expected Status:** 200 OK
- **Verify:**
  - Returns single score record
  - Includes student and subject details
  - Correct marks value

#### Test 6.2: Get Student-Subject Performance (No Score)
- **Method:** GET `/api/scores/student/1/subject/2` (no score for this combination)
- **Expected Status:** 404 Not Found
- **Verify:**
  - Error indicates no score found

---

### Section 7: CRUD Operations

#### Test 7.1: Get All Scores
- **Method:** GET `/api/scores`
- **Expected Status:** 200 OK
- **Verify:**
  - Returns array of all scores
  - Each score includes student and subject
  - Proper response format

#### Test 7.2: Get Score by ID
- **Method:** GET `/api/scores/1`
- **Expected Status:** 200 OK
- **Verify:**
  - Correct score returned
  - Student and subject details included

#### Test 7.3: Get Score by ID (Not Found)
- **Method:** GET `/api/scores/99999`
- **Expected Status:** 404 Not Found

#### Test 7.4: Delete Score
- **Method:** DELETE `/api/scores/1`
- **Expected Status:** 200 OK
- **Verify:**
  - Score removed from database
  - GET /scores/1 returns 404

#### Test 7.5: Delete Non-existent Score
- **Method:** DELETE `/api/scores/99999`
- **Expected Status:** 200 OK (idempotent) or 404
- **Verify:**
  - Consistent behavior

---

### Section 8: Response Format Validation

#### Test 8.1: Success Response Format
- **Any successful request**
- **Verify:**
  ```json
  {
    "success": true,
    "message": "...",
    "data": { },
    "error": null
  }
  ```

#### Test 8.2: Error Response Format
- **Any failed request**
- **Verify:**
  ```json
  {
    "success": false,
    "message": "...",
    "data": null,
    "error": "..."
  }
  ```

#### Test 8.3: Status Code Consistency
- **Verify HTTP status codes:**
  - 200 OK for GET, PUT, DELETE
  - 201 Created for POST
  - 400 Bad Request for validation errors
  - 404 Not Found for missing resources
  - 409 Conflict for duplicate scores

---

## Database Verification

### SQL Queries for Verification

#### Verify Score Created
```sql
SELECT * FROM assessments WHERE student_id = 1 AND subject_id = 1;
```

#### Verify Unique Constraint
```sql
SELECT student_id, subject_id, COUNT(*) 
FROM assessments 
GROUP BY student_id, subject_id 
HAVING COUNT(*) > 1;
-- Should return empty result set
```

#### Verify Aggregation Accuracy
```sql
SELECT COUNT(*) as total, AVG(marks) as average, MIN(marks) as min_score, MAX(marks) as max_score
FROM assessments WHERE student_id = 1;
```

#### Verify Subject Statistics
```sql
SELECT AVG(marks) as class_avg, PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY marks) as median
FROM assessments WHERE subject_id = 1;
```

#### Verify Cascade Delete
```sql
-- After deleting a student
SELECT * FROM assessments WHERE student_id = 1;
-- Should be empty
```

---

## Performance Considerations

- **Index on student_id:** For fast student performance queries
- **Index on subject_id:** For fast subject performance queries
- **Composite Index on (student_id, subject_id):** For UNIQUE constraint efficiency
- **Aggregation Performance:** Test GROUP BY with 1000+ scores
- **PERCENTILE_CONT:** Test median calculation performance

---

## Summary Checklist

- [ ] Score entry validation (15 tests)
- [ ] Duplicate prevention (3 tests)
- [ ] Score update (9 tests)
- [ ] Student performance queries (5 tests)
- [ ] Subject/class performance queries (6 tests)
- [ ] Student-subject specific performance (2 tests)
- [ ] CRUD operations (5 tests)
- [ ] Response format validation (3 tests)
- [ ] Database verification SQL queries
- [ ] Aggregate calculations verified
- [ ] Cascade delete tested
- [ ] Status codes match expectations

**Total Test Cases:** 48+ manual tests + database verification
