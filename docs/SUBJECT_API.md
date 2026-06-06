# Subject Management API Documentation

## Overview
The Subject API provides endpoints for managing academic subjects and their relationships with class streams. This document covers all available endpoints, request/response formats, validation rules, and error handling.

## Base URL
```
http://localhost:5000/api/subjects
```

## Authentication
Currently, all endpoints are accessible without authentication. JWT authentication will be implemented in a future phase.

---

## Endpoints

### 1. Get All Subjects

**Endpoint:** `GET /api/subjects`

**Description:** Retrieves a list of all subjects with their stream assignments and assessment records.

**Query Parameters:** None

**Response:**
```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "name": "Mathematics",
      "code": "MATH101",
      "streams": [
        {
          "id": 1,
          "name": "Science Stream A",
          "code": "SCI-A",
          "description": "Science specialization track"
        }
      ],
      "scores": [
        {
          "id": 1,
          "studentId": 5,
          "marks": 85.5,
          "assessmentType": "exam",
          "student": {
            "registrationNumber": "STU001",
            "firstName": "John",
            "lastName": "Doe",
            "email": "john.doe@example.com"
          },
          "createdAt": "2026-06-04T10:30:00Z",
          "updatedAt": "2026-06-04T10:30:00Z"
        }
      ],
      "createdAt": "2026-06-04T10:00:00Z",
      "updatedAt": "2026-06-04T10:00:00Z"
    }
  ],
  "error": null
}
```

**Status Codes:**
- `200 OK` - Subjects retrieved successfully

---

### 2. Get Subject by ID

**Endpoint:** `GET /api/subjects/:id`

**Description:** Retrieves a specific subject with its stream assignments and assessment records.

**Path Parameters:**
- `id` (integer, required) - Subject ID

**Response:**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": 1,
    "name": "Mathematics",
    "code": "MATH101",
    "streams": [
      {
        "id": 1,
        "name": "Science Stream A",
        "code": "SCI-A",
        "description": "Science specialization track"
      }
    ],
    "scores": [],
    "createdAt": "2026-06-04T10:00:00Z",
    "updatedAt": "2026-06-04T10:00:00Z"
  },
  "error": null
}
```

**Status Codes:**
- `200 OK` - Subject retrieved successfully
- `404 Not Found` - Subject with specified ID not found

**Example Error Response (404):**
```json
{
  "success": false,
  "message": "Subject not found",
  "data": null,
  "error": "Subject not found"
}
```

---

### 3. Create Subject

**Endpoint:** `POST /api/subjects`

**Description:** Creates a new subject.

**Request Body:**
```json
{
  "name": "Mathematics",
  "code": "MATH101"
}
```

**Field Validation Rules:**

| Field | Type | Required | Constraints | Example |
|-------|------|----------|-------------|---------|
| name | string | Yes | 2-100 characters | "Mathematics" |
| code | string | Yes | 2-20 characters, unique | "MATH101" |

**Response:**
```json
{
  "success": true,
  "message": "Subject created successfully",
  "data": {
    "id": 1,
    "name": "Mathematics",
    "code": "MATH101",
    "streams": [],
    "scores": [],
    "createdAt": "2026-06-04T10:00:00Z",
    "updatedAt": "2026-06-04T10:00:00Z"
  },
  "error": null
}
```

**Status Codes:**
- `201 Created` - Subject created successfully
- `400 Bad Request` - Validation error
- `409 Conflict` - Subject code already exists (unique constraint)

**Example Error Response (Validation):**
```json
{
  "success": false,
  "message": "Validation error",
  "data": null,
  "error": [
    {
      "field": "name",
      "message": "Subject name must be at least 2 characters"
    },
    {
      "field": "code",
      "message": "Subject code is required"
    }
  ]
}
```

**Example Error Response (Duplicate Code):**
```json
{
  "success": false,
  "message": "Validation error",
  "data": null,
  "error": "Subject code already exists"
}
```

---

### 4. Update Subject

**Endpoint:** `PUT /api/subjects/:id`

**Description:** Updates subject details (name and/or code).

**Path Parameters:**
- `id` (integer, required) - Subject ID

**Request Body:**
```json
{
  "name": "Advanced Mathematics",
  "code": "MATH102"
}
```

**Field Validation Rules:**

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| name | string | No | 2-100 characters if provided |
| code | string | No | 2-20 characters if provided |

**Notes:**
- At least one field must be provided
- Code must be unique across all subjects
- Updates automatically set `updated_at` timestamp

**Response:**
```json
{
  "success": true,
  "message": "Subject updated successfully",
  "data": {
    "id": 1,
    "name": "Advanced Mathematics",
    "code": "MATH102",
    "streams": [],
    "scores": [],
    "createdAt": "2026-06-04T10:00:00Z",
    "updatedAt": "2026-06-04T10:15:00Z"
  },
  "error": null
}
```

**Status Codes:**
- `200 OK` - Subject updated successfully
- `400 Bad Request` - Validation error (empty request body, invalid field values)
- `404 Not Found` - Subject not found
- `409 Conflict` - Code already exists or other constraint violation

**Example Error Response (No Fields):**
```json
{
  "success": false,
  "message": "Validation error",
  "data": null,
  "error": [
    {
      "field": null,
      "message": "At least one field must be provided for update"
    }
  ]
}
```

---

### 5. Delete Subject

**Endpoint:** `DELETE /api/subjects/:id`

**Description:** Deletes a subject and all its stream associations and assessment records.

**Path Parameters:**
- `id` (integer, required) - Subject ID

**Response:**
```json
{
  "success": true,
  "message": "Subject deleted successfully",
  "data": null,
  "error": null
}
```

**Status Codes:**
- `200 OK` - Subject deleted successfully
- `404 Not Found` - Subject not found (if implementation includes existence check)

**Cascade Effects:**
- All `stream_subjects` records linking this subject to streams are deleted
- All `assessments` records for this subject are deleted
- This is enforced by database foreign key constraints with `ON DELETE CASCADE`

---

### 6. Get Subjects by Stream

**Endpoint:** `GET /api/subjects/stream/:streamId`

**Description:** Retrieves all subjects assigned to a specific class stream.

**Path Parameters:**
- `streamId` (integer, required) - Class stream ID

**Response:**
```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "name": "Mathematics",
      "code": "MATH101",
      "createdAt": "2026-06-04T10:00:00Z",
      "updatedAt": "2026-06-04T10:00:00Z"
    },
    {
      "id": 2,
      "name": "Physics",
      "code": "PHY101",
      "createdAt": "2026-06-04T10:00:00Z",
      "updatedAt": "2026-06-04T10:00:00Z"
    }
  ],
  "error": null
}
```

**Status Codes:**
- `200 OK` - Subjects retrieved (may be empty array if stream has no subjects)

**Query Example:**
```
GET /api/subjects/stream/1
```

---

### 7. Assign Subject to Stream

**Endpoint:** `POST /api/subjects/:id/streams`

**Description:** Assigns a subject to a class stream, creating a many-to-many relationship.

**Path Parameters:**
- `id` (integer, required) - Subject ID

**Request Body:**
```json
{
  "streamId": 1
}
```

**Field Validation Rules:**

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| streamId | integer | Yes | Must reference existing stream |

**Response:**
```json
{
  "success": true,
  "message": "Subject assigned to stream successfully",
  "data": {
    "id": 1,
    "name": "Mathematics",
    "code": "MATH101",
    "streams": [
      {
        "id": 1,
        "name": "Science Stream A",
        "code": "SCI-A",
        "description": "Science specialization track"
      }
    ],
    "scores": [],
    "createdAt": "2026-06-04T10:00:00Z",
    "updatedAt": "2026-06-04T10:00:00Z"
  },
  "error": null
}
```

**Status Codes:**
- `201 Created` - Subject assigned successfully
- `400 Bad Request` - Invalid stream ID or validation error
- `404 Not Found` - Subject not found
- `409 Conflict` - Subject already assigned to this stream (duplicate prevention)

**Example Error Response (Duplicate Assignment):**
```json
{
  "success": false,
  "message": "Subject is already assigned to this stream",
  "data": null,
  "error": "Subject is already assigned to this stream"
}
```

**Duplicate Prevention:**
- Database constraint: `UNIQUE (stream_id, subject_id)` on `stream_subjects` table
- Attempting to assign the same subject to the same stream twice returns `409 Conflict`

---

### 8. Remove Subject from Stream

**Endpoint:** `DELETE /api/subjects/:id/streams/:streamId`

**Description:** Removes a subject from a class stream, breaking the many-to-many relationship.

**Path Parameters:**
- `id` (integer, required) - Subject ID
- `streamId` (integer, required) - Class stream ID

**Response:**
```json
{
  "success": true,
  "message": "Subject removed from stream successfully",
  "data": null,
  "error": null
}
```

**Status Codes:**
- `200 OK` - Subject removed successfully
- `400 Bad Request` - Subject not assigned to this stream
- `404 Not Found` - Subject or stream not found

**Example Error Response (Not Assigned):**
```json
{
  "success": false,
  "message": "Subject is not assigned to this stream",
  "data": null,
  "error": "Subject is not assigned to this stream"
}
```

---

## Data Models

### Subject Object
```json
{
  "id": 1,
  "name": "Mathematics",
  "code": "MATH101",
  "streams": [],
  "scores": [],
  "createdAt": "2026-06-04T10:00:00Z",
  "updatedAt": "2026-06-04T10:00:00Z"
}
```

### Stream Assignment Object (in Subject)
```json
{
  "id": 1,
  "name": "Science Stream A",
  "code": "SCI-A",
  "description": "Science specialization track"
}
```

### Assessment Object (in Subject)
```json
{
  "id": 1,
  "studentId": 5,
  "marks": 85.5,
  "assessmentType": "exam",
  "student": {
    "registrationNumber": "STU001",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com"
  },
  "createdAt": "2026-06-04T10:30:00Z",
  "updatedAt": "2026-06-04T10:30:00Z"
}
```

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
| 400 | Bad Request | Invalid input, validation errors |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate code or assignment |
| 500 | Server Error | Database or server issues |

### Validation Error Format
```json
{
  "success": false,
  "message": "Validation error",
  "data": null,
  "error": [
    {
      "field": "name",
      "message": "Subject name is required"
    }
  ]
}
```

---

## Database Constraints

### Uniqueness Constraints
- **Subject Code:** Unique across all subjects (`subjects.code UNIQUE`)
- **Stream-Subject Pair:** Unique combination prevents duplicate assignments (`stream_subjects UNIQUE(stream_id, subject_id)`)

### Foreign Key Constraints
- **stream_id in stream_subjects:** References `class_streams(id)` with `ON DELETE CASCADE`
- **subject_id in stream_subjects:** References `subjects(id)` with `ON DELETE CASCADE`
- **subject_id in assessments:** References `subjects(id)` with `ON DELETE CASCADE`

### Cascade Delete Effects
When a subject is deleted:
1. All `stream_subjects` records linking it to streams are deleted
2. All `assessments` records for that subject are deleted

---

## Postman Setup

### Import Collection
1. Open Postman
2. Click "Import" → "Raw Text"
3. Paste the following cURL commands and convert to Postman requests

### Sample Requests

#### Create Subject
```bash
curl -X POST http://localhost:5000/api/subjects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mathematics",
    "code": "MATH101"
  }'
```

#### Get All Subjects
```bash
curl -X GET http://localhost:5000/api/subjects \
  -H "Content-Type: application/json"
```

#### Get Subjects by Stream
```bash
curl -X GET http://localhost:5000/api/subjects/stream/1 \
  -H "Content-Type: application/json"
```

#### Assign Subject to Stream
```bash
curl -X POST http://localhost:5000/api/subjects/1/streams \
  -H "Content-Type: application/json" \
  -d '{
    "streamId": 1
  }'
```

#### Update Subject
```bash
curl -X PUT http://localhost:5000/api/subjects/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Advanced Mathematics"
  }'
```

#### Remove Subject from Stream
```bash
curl -X DELETE http://localhost:5000/api/subjects/1/streams/1 \
  -H "Content-Type: application/json"
```

#### Delete Subject
```bash
curl -X DELETE http://localhost:5000/api/subjects/1 \
  -H "Content-Type: application/json"
```

---

## Testing Recommendations

- Test all CRUD operations with valid inputs
- Test validation edge cases (empty strings, max length + 1, special characters)
- Test duplicate code assignment (should fail with 409)
- Test duplicate stream assignment (should fail with 409)
- Test cascade delete (delete subject, verify stream_subjects and assessments are deleted)
- Test stream filtering (assign multiple subjects to stream, verify all are retrieved)
- Test API response format consistency (all responses follow `{success, message, data, error}`)
