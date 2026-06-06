# Student Management API Endpoints Documentation

## Base URL
```
http://localhost:5000/api/students
```

## Overview
The Student API manages student registration, profile management, stream assignment, and retrieval by academic streams. All students must be assigned to a class stream, and registration numbers must be unique.

---

## Endpoints

### 1. Register Student (Create)
**Endpoint:** `POST /api/students`

**Description:** Register a new student in the system and assign them to a class stream.

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "registrationNumber": "STU001",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "dateOfBirth": "2008-05-15",
  "streamId": 1
}
```

**Field Validation Rules:**
- `registrationNumber` (required): 3-50 characters, must be unique
- `firstName` (required): 2-100 characters
- `lastName` (required): 2-100 characters
- `email` (required): valid email format, must be unique
- `dateOfBirth` (required): valid date
- `streamId` (required): valid integer, must reference existing stream

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Student registered successfully",
  "data": {
    "id": 1,
    "registrationNumber": "STU001",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "dateOfBirth": "2008-05-15",
    "stream": {
      "id": 1,
      "name": "Class 10A",
      "code": "SCI10A",
      "description": "Science Stream - Class 10A"
    },
    "scores": [],
    "createdAt": "2024-06-04T10:30:00Z",
    "updatedAt": "2024-06-04T10:30:00Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation error",
  "error": [
    "Registration number must be at least 3 characters",
    "Email must be a valid email address"
  ]
}
```

**Error Response (409 Conflict - Duplicate):**
```json
{
  "success": false,
  "message": "Registration number already exists",
  "error": null
}
```

---

### 2. Get All Students
**Endpoint:** `GET /api/students`

**Description:** Retrieve all registered students with their stream information and assessment scores.

**Query Parameters:** None

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "registrationNumber": "STU001",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "dateOfBirth": "2008-05-15",
      "stream": {
        "id": 1,
        "name": "Class 10A",
        "code": "SCI10A",
        "description": "Science Stream - Class 10A"
      },
      "scores": [
        {
          "id": 1,
          "studentId": 1,
          "subjectId": 1,
          "subject": {
            "id": 1,
            "name": "Mathematics",
            "code": "MATH101"
          },
          "marks": 85.00,
          "assessmentType": "test",
          "createdAt": "2024-06-04T11:00:00Z",
          "updatedAt": "2024-06-04T11:00:00Z"
        }
      ],
      "createdAt": "2024-06-04T10:30:00Z",
      "updatedAt": "2024-06-04T10:30:00Z"
    }
  ]
}
```

---

### 3. Get Student by ID
**Endpoint:** `GET /api/students/:id`

**Description:** Retrieve a specific student's profile with all scores and stream information.

**Parameters:**
- `id` (path): Student ID (required, integer)

**Example Request:**
```
GET /api/students/1
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": 1,
    "registrationNumber": "STU001",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "dateOfBirth": "2008-05-15",
    "stream": {
      "id": 1,
      "name": "Class 10A",
      "code": "SCI10A",
      "description": "Science Stream - Class 10A"
    },
    "scores": [],
    "createdAt": "2024-06-04T10:30:00Z",
    "updatedAt": "2024-06-04T10:30:00Z"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Student not found",
  "error": null
}
```

---

### 4. Get Students by Stream
**Endpoint:** `GET /api/students/stream/:streamId`

**Description:** Retrieve all students enrolled in a specific class stream.

**Parameters:**
- `streamId` (path): Class Stream ID (required, integer)

**Example Request:**
```
GET /api/students/stream/1
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Students from stream 1",
  "data": [
    {
      "id": 1,
      "registrationNumber": "STU001",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "dateOfBirth": "2008-05-15",
      "stream": {
        "id": 1,
        "name": "Class 10A",
        "code": "SCI10A",
        "description": "Science Stream - Class 10A"
      },
      "scores": [],
      "createdAt": "2024-06-04T10:30:00Z",
      "updatedAt": "2024-06-04T10:30:00Z"
    }
  ]
}
```

**Response (200 OK - Empty Stream):**
```json
{
  "success": true,
  "message": "Students from stream 1",
  "data": []
}
```

---

### 5. Update Student
**Endpoint:** `PUT /api/students/:id`

**Description:** Update student information. Registration to a different stream is possible.

**Parameters:**
- `id` (path): Student ID (required, integer)

**Request Headers:**
```
Content-Type: application/json
```

**Request Body (at least one field required):**
```json
{
  "firstName": "Jonathan",
  "lastName": "Doe Smith",
  "streamId": 2,
  "email": "john.doe.updated@example.com"
}
```

**Field Validation Rules:**
- At least one field must be provided
- `registrationNumber`: 3-50 characters
- `firstName`: 2-100 characters
- `lastName`: 2-100 characters
- `email`: valid email format
- `dateOfBirth`: valid date
- `streamId`: valid integer

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Student updated successfully",
  "data": {
    "id": 1,
    "registrationNumber": "STU001",
    "firstName": "Jonathan",
    "lastName": "Doe Smith",
    "email": "john.doe.updated@example.com",
    "dateOfBirth": "2008-05-15",
    "stream": {
      "id": 2,
      "name": "Class 10B",
      "code": "COM10B",
      "description": "Commerce Stream - Class 10B"
    },
    "scores": [],
    "createdAt": "2024-06-04T10:30:00Z",
    "updatedAt": "2024-06-04T11:00:00Z"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Student not found",
  "error": null
}
```

---

### 6. Delete Student
**Endpoint:** `DELETE /api/students/:id`

**Description:** Delete a student from the system. All associated assessment scores will be cascaded deleted.

**Parameters:**
- `id` (path): Student ID (required, integer)

**Example Request:**
```
DELETE /api/students/1
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Student deleted successfully",
  "data": null
}
```

---

## Database Constraints

### Unique Constraints
- `registration_number`: Must be unique across all students
- `email`: Must be unique across all students

### Foreign Key Constraints
- `stream_id`: Must reference a valid `class_streams.id`
- Cascade delete: When a stream is deleted, all students in that stream are deleted

### Data Types
- `registration_number`: TEXT
- `first_name`, `last_name`: TEXT
- `email`: TEXT
- `date_of_birth`: DATE
- `stream_id`: INTEGER (FK to class_streams)
- `created_at`, `updated_at`: TIMESTAMPTZ

---

## Testing in Postman

### Environment Variables
```
base_url = http://localhost:5000
student_id = 1
stream_id = 1
```

### Test Sequence

**1. Create Student (POST)**
```
POST {{base_url}}/api/students
Body:
{
  "registrationNumber": "STU005",
  "firstName": "Alice",
  "lastName": "Williams",
  "email": "alice.williams@example.com",
  "dateOfBirth": "2008-09-05",
  "streamId": 2
}
```

**2. Get All Students (GET)**
```
GET {{base_url}}/api/students
```

**3. Get Student by ID (GET)**
```
GET {{base_url}}/api/students/{{student_id}}
```

**4. Get Students by Stream (GET)**
```
GET {{base_url}}/api/students/stream/{{stream_id}}
```

**5. Update Student (PUT)**
```
PUT {{base_url}}/api/students/{{student_id}}
Body:
{
  "firstName": "Alice Marie",
  "email": "alice.marie@example.com"
}
```

**6. Delete Student (DELETE)**
```
DELETE {{base_url}}/api/students/{{student_id}}
```

---

## Error Codes

| Code | Message | Cause |
|------|---------|-------|
| 200 | Success | Request processed successfully |
| 201 | Student registered successfully | Student created with valid data |
| 400 | Validation error | Invalid or missing required fields |
| 404 | Student not found | Student ID does not exist |
| 409 | Registration number already exists | Duplicate registration number |
| 409 | Email already exists | Duplicate email |
| 500 | Internal Server Error | Unexpected server error |

---

## Key Features

✅ Stream Assignment: Students must be assigned to a valid class stream
✅ Unique Registration: Each student has a unique registration number
✅ Unique Email: Email addresses are unique in the system
✅ JOIN Queries: Efficient retrieval with stream and assessment data
✅ Cascade Delete: Deleting a student removes associated scores
✅ Type Validation: Strict field validation with custom error messages
