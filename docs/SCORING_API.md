# Score Management & Assessment API Documentation

## Overview
The Score API provides endpoints for managing student assessments and performance analytics. This document covers all available endpoints, request/response formats, validation rules, and error handling.

## Base URL
```
http://localhost:5000/api/scores
```

## Authentication
Currently, all endpoints are accessible without authentication. JWT authentication will be implemented in a future phase.

---

## Endpoints

### 1. Get All Scores

**Endpoint:** `GET /api/scores`

**Description:** Retrieves a list of all assessment scores with student and subject information.

**Response:**
```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "marks": 85.5,
      "assessmentType": "exam",
      "createdAt": "2026-06-04T10:30:00Z",
      "updatedAt": "2026-06-04T10:30:00Z",
      "student": {
        "id": 5,
        "registrationNumber": "STU001",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com"
      },
      "subject": {
        "id": 1,
        "name": "Mathematics",
        "code": "MATH101"
      }
    }
  ],
  "error": null
}
```

**Status Codes:**
- `200 OK` - Scores retrieved successfully

---

### 2. Get Score by ID

**Endpoint:** `GET /api/scores/:id`

**Description:** Retrieves a specific score record with full student and subject details.

**Path Parameters:**
- `id` (integer, required) - Score/Assessment ID

**Response:**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": 1,
    "marks": 85.5,
    "assessmentType": "exam",
    "createdAt": "2026-06-04T10:30:00Z",
    "updatedAt": "2026-06-04T10:30:00Z",
    "student": {
      "id": 5,
      "registrationNumber": "STU001",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com"
    },
    "subject": {
      "id": 1,
      "name": "Mathematics",
      "code": "MATH101"
    }
  },
  "error": null
}
```

**Status Codes:**
- `200 OK` - Score retrieved successfully
- `404 Not Found` - Score not found

---

### 3. Create Score (Entry)

**Endpoint:** `POST /api/scores`

**Description:** Creates a new assessment score entry for a student in a subject.

**Request Body:**
```json
{
  "studentId": 5,
  "subjectId": 1,
  "marks": 85.5,
  "assessmentType": "exam"
}
```

**Field Validation Rules:**

| Field | Type | Required | Constraints | Example |
|-------|------|----------|-------------|---------|
| studentId | integer | Yes | Must reference existing student | 5 |
| subjectId | integer | Yes | Must reference existing subject | 1 |
| marks | number | Yes | 0-100 inclusive | 85.5 |
| assessmentType | string | Yes | One of: test, assignment, exam | "exam" |

**Response:**
```json
{
  "success": true,
  "message": "Score created successfully",
  "data": {
    "id": 1,
    "marks": 85.5,
    "assessmentType": "exam",
    "createdAt": "2026-06-04T10:30:00Z",
    "updatedAt": "2026-06-04T10:30:00Z",
    "student": {
      "id": 5,
      "registrationNumber": "STU001",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com"
    },
    "subject": {
      "id": 1,
      "name": "Mathematics",
      "code": "MATH101"
    }
  },
  "error": null
}
```

**Status Codes:**
- `201 Created` - Score created successfully
- `400 Bad Request` - Validation error (invalid marks, type, missing fields)
- `404 Not Found` - Student or subject not found (FK constraint)
- `409 Conflict` - Duplicate score for this student-subject combination

**Example Error Response (Out of Range):**
```json
{
  "success": false,
  "message": "Validation error",
  "data": null,
  "error": [
    {
      "field": "marks",
      "message": "Marks cannot exceed 100"
    }
  ]
}
```

**Example Error Response (Duplicate):**
```json
{
  "success": false,
  "message": "A score already exists for this student and subject combination",
  "data": null,
  "error": "A score already exists for this student and subject combination"
}
```

**Duplicate Prevention:**
- Database constraint: `UNIQUE (student_id, subject_id)` on assessments table
- Each student can have only ONE score per subject
- Attempting to create duplicate returns `409 Conflict`

---

### 4. Update Score

**Endpoint:** `PUT /api/scores/:id`

**Description:** Updates an assessment score (marks and/or assessment type).

**Path Parameters:**
- `id` (integer, required) - Score/Assessment ID

**Request Body:**
```json
{
  "marks": 90,
  "assessmentType": "test"
}
```

**Field Validation Rules:**

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| marks | number | No | 0-100 if provided |
| assessmentType | string | No | Must be test, assignment, or exam if provided |

**Notes:**
- At least one field must be provided
- Cannot update studentId or subjectId (immutable)
- Updates automatically set `updated_at` timestamp

**Response:**
```json
{
  "success": true,
  "message": "Score updated successfully",
  "data": {
    "id": 1,
    "marks": 90,
    "assessmentType": "test",
    "createdAt": "2026-06-04T10:30:00Z",
    "updatedAt": "2026-06-04T10:35:00Z",
    "student": { },
    "subject": { }
  },
  "error": null
}
```

**Status Codes:**
- `200 OK` - Score updated successfully
- `400 Bad Request` - Validation error or empty request
- `404 Not Found` - Score not found

---

### 5. Delete Score

**Endpoint:** `DELETE /api/scores/:id`

**Description:** Deletes an assessment score record.

**Path Parameters:**
- `id` (integer, required) - Score/Assessment ID

**Response:**
```json
{
  "success": true,
  "message": "Score deleted successfully",
  "data": null,
  "error": null
}
```

**Status Codes:**
- `200 OK` - Score deleted successfully

---

### 6. Get Student Performance

**Endpoint:** `GET /api/scores/student/:studentId`

**Description:** Retrieves all assessment scores for a specific student, organized by subject.

**Path Parameters:**
- `studentId` (integer, required) - Student ID

**Response:**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "student": {
      "id": 5,
      "registrationNumber": "STU001",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com"
    },
    "scores": [
      {
        "id": 1,
        "marks": 85.5,
        "assessmentType": "exam",
        "subject": {
          "id": 1,
          "name": "Mathematics",
          "code": "MATH101"
        },
        "createdAt": "2026-06-04T10:30:00Z",
        "updatedAt": "2026-06-04T10:30:00Z"
      },
      {
        "id": 2,
        "marks": 92,
        "assessmentType": "test",
        "subject": {
          "id": 2,
          "name": "Physics",
          "code": "PHY101"
        },
        "createdAt": "2026-06-04T10:31:00Z",
        "updatedAt": "2026-06-04T10:31:00Z"
      }
    ]
  },
  "error": null
}
```

**Status Codes:**
- `200 OK` - Performance retrieved
- `404 Not Found` - Student not found or no scores

**Features:**
- Returns all scores grouped by student
- Sorted by subject name, then chronologically
- Includes full subject information

---

### 7. Get Subject Performance (Class View)

**Endpoint:** `GET /api/scores/subject/:subjectId`

**Description:** Retrieves all assessment scores for a specific subject (all students).

**Path Parameters:**
- `subjectId` (integer, required) - Subject ID

**Response:**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "subject": {
      "id": 1,
      "name": "Mathematics",
      "code": "MATH101"
    },
    "scores": [
      {
        "id": 1,
        "marks": 85.5,
        "assessmentType": "exam",
        "student": {
          "id": 5,
          "registrationNumber": "STU001",
          "firstName": "John",
          "lastName": "Doe",
          "email": "john.doe@example.com"
        },
        "createdAt": "2026-06-04T10:30:00Z",
        "updatedAt": "2026-06-04T10:30:00Z"
      }
    ]
  },
  "error": null
}
```

**Status Codes:**
- `200 OK` - Performance retrieved
- `404 Not Found` - Subject not found or no scores

**Features:**
- Returns all scores for a subject
- Sorted by student name, then chronologically
- Useful for class/subject performance analysis

---

### 8. Get Student Aggregates

**Endpoint:** `GET /api/scores/student/:studentId/aggregates`

**Description:** Retrieves aggregated statistics for a student's overall performance.

**Path Parameters:**
- `studentId` (integer, required) - Student ID

**Response:**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "student": {
      "id": 5,
      "registrationNumber": "STU001",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com"
    },
    "statistics": {
      "totalAssessments": 5,
      "averageMarks": "86.50",
      "minMarks": "78.00",
      "maxMarks": "95.00",
      "subjectsTaken": ["Mathematics", "Physics", "Chemistry"]
    }
  },
  "error": null
}
```

**Status Codes:**
- `200 OK` - Aggregates retrieved
- `404 Not Found` - Student not found

**Metrics Provided:**
- **totalAssessments:** Total number of scores for this student
- **averageMarks:** Mean score across all assessments
- **minMarks:** Lowest score
- **maxMarks:** Highest score
- **subjectsTaken:** List of unique subjects assessed

---

### 9. Get Subject Aggregates (Class Statistics)

**Endpoint:** `GET /api/scores/subject/:subjectId/aggregates`

**Description:** Retrieves aggregated statistics for class performance in a subject.

**Path Parameters:**
- `subjectId` (integer, required) - Subject ID

**Response:**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "subject": {
      "id": 1,
      "name": "Mathematics",
      "code": "MATH101"
    },
    "statistics": {
      "totalScores": 30,
      "classAverage": "82.40",
      "minMarks": "45.00",
      "maxMarks": "98.50",
      "medianMarks": "85.00",
      "studentsAssessed": 30
    }
  },
  "error": null
}
```

**Status Codes:**
- `200 OK` - Aggregates retrieved
- `404 Not Found` - Subject not found

**Metrics Provided:**
- **totalScores:** Total number of score entries for this subject
- **classAverage:** Mean score across all students
- **minMarks:** Lowest mark in the class
- **maxMarks:** Highest mark in the class
- **medianMarks:** Median score (50th percentile)
- **studentsAssessed:** Number of unique students assessed

---

### 10. Get Student-Subject Performance

**Endpoint:** `GET /api/scores/student/:studentId/subject/:subjectId`

**Description:** Retrieves the specific score for a student in a subject.

**Path Parameters:**
- `studentId` (integer, required) - Student ID
- `subjectId` (integer, required) - Subject ID

**Response:**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": 1,
    "marks": 85.5,
    "assessmentType": "exam",
    "student": {
      "id": 5,
      "registrationNumber": "STU001",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com"
    },
    "subject": {
      "id": 1,
      "name": "Mathematics",
      "code": "MATH101"
    },
    "createdAt": "2026-06-04T10:30:00Z",
    "updatedAt": "2026-06-04T10:30:00Z"
  },
  "error": null
}
```

**Status Codes:**
- `200 OK` - Score retrieved
- `404 Not Found` - No score found for this student-subject combination

---

## Validation Rules

### Marks Field
- **Type:** Number (decimal allowed)
- **Range:** 0 to 100 (inclusive)
- **Required:** Yes
- **Error Messages:**
  - "Marks must be a number" (if not numeric)
  - "Marks must be at least 0" (if < 0)
  - "Marks cannot exceed 100" (if > 100)
  - "Marks are required" (if omitted)

### Assessment Type Field
- **Type:** String
- **Valid Values:** "test", "assignment", "exam"
- **Required:** Yes (on create, optional on update)
- **Error Messages:**
  - "Assessment type must be one of: test, assignment, exam"
  - "Assessment type is required" (on create)

### Student ID Field
- **Type:** Integer
- **Required:** Yes
- **Validation:** Must reference an existing student (FK constraint)
- **Immutable:** Cannot be changed via update

### Subject ID Field
- **Type:** Integer
- **Required:** Yes
- **Validation:** Must reference an existing subject (FK constraint)
- **Immutable:** Cannot be changed via update

---

## Database Constraints

### Uniqueness Constraints
- **Student-Subject Pair:** `UNIQUE (student_id, subject_id)` on assessments table
  - Prevents duplicate scores for same student in same subject
  - Returns `409 Conflict` on duplicate attempt

### Foreign Key Constraints
- **student_id:** References `students(id)` with `ON DELETE CASCADE`
- **subject_id:** References `subjects(id)` with `ON DELETE CASCADE`

### Check Constraints (Implicit in Validation)
- **marks:** Must be between 0 and 100

### Cascade Delete Effects
When a student is deleted:
- All assessment records for that student are deleted

When a subject is deleted:
- All assessment records for that subject are deleted

---

## Error Handling

### Standard Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "data": null,
  "error": "Error details (string or array)"
}
```

### Common HTTP Status Codes

| Code | Meaning | Common Causes |
|------|---------|---------------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | Invalid marks (0-100), invalid type, missing fields, empty update |
| 404 | Not Found | Score/student/subject doesn't exist |
| 409 | Conflict | Duplicate student-subject score, FK violation |
| 500 | Server Error | Database or server issues |

### Validation Error Format
```json
{
  "success": false,
  "message": "Validation error",
  "data": null,
  "error": [
    {
      "field": "marks",
      "message": "Marks cannot exceed 100"
    }
  ]
}
```

---

## SQL Query Examples

### Get Student Performance with GROUP BY
```sql
SELECT s.id, s.registration_number, COUNT(a.id) as total_scores,
       AVG(a.marks) as average_marks, MIN(a.marks) as min_marks, 
       MAX(a.marks) as max_marks
FROM students s
LEFT JOIN assessments a ON s.id = a.student_id
WHERE s.id = 5
GROUP BY s.id, s.registration_number;
```

### Get Class Statistics for Subject
```sql
SELECT sub.id, sub.name, COUNT(a.id) as total_scores,
       AVG(a.marks) as class_average, PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY a.marks) as median
FROM subjects sub
LEFT JOIN assessments a ON sub.id = a.subject_id
WHERE sub.id = 1
GROUP BY sub.id, sub.name;
```

### Get All Scores with JOINs
```sql
SELECT a.*, s.registration_number, sub.name as subject_name
FROM assessments a
JOIN students s ON a.student_id = s.id
JOIN subjects sub ON a.subject_id = sub.id
ORDER BY a.created_at DESC;
```

---

## Postman Setup

### Sample Requests

#### Create Score
```bash
curl -X POST http://localhost:5000/api/scores \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": 5,
    "subjectId": 1,
    "marks": 85.5,
    "assessmentType": "exam"
  }'
```

#### Get Student Performance
```bash
curl -X GET http://localhost:5000/api/scores/student/5
```

#### Get Subject Performance
```bash
curl -X GET http://localhost:5000/api/scores/subject/1
```

#### Get Student Aggregates
```bash
curl -X GET http://localhost:5000/api/scores/student/5/aggregates
```

#### Get Subject Aggregates
```bash
curl -X GET http://localhost:5000/api/scores/subject/1/aggregates
```

#### Update Score
```bash
curl -X PUT http://localhost:5000/api/scores/1 \
  -H "Content-Type: application/json" \
  -d '{
    "marks": 90
  }'
```

#### Delete Score
```bash
curl -X DELETE http://localhost:5000/api/scores/1
```

---

## Testing Recommendations

- Test marks validation (0, 50, 100, -1, 101, 100.5, "abc")
- Test duplicate prevention (same student-subject)
- Test assessment type validation (test, assignment, exam, invalid)
- Test FK constraints (invalid student/subject IDs)
- Test aggregations with various student/subject combinations
- Test cascade delete (delete student, verify scores gone)
- Test response format consistency
- Test error handling for all edge cases
- Test performance with large datasets (1000+ scores)
