# Phase 5: Student Management Module - Testing Checklist

## Prerequisites
- Backend server running: `npm run dev`
- PostgreSQL database with schema initialized
- Sample streams created (from Phase 4)
- Postman or similar API testing tool
- Base URL: `http://localhost:5000/api/students`

---

## Test Cases

### Test 1: Register New Student (POST)
- [ ] **URL:** `POST http://localhost:5000/api/students`
- [ ] **Body:**
```json
{
  "registrationNumber": "STU007",
  "firstName": "Michael",
  "lastName": "Brown",
  "email": "michael.brown@example.com",
  "dateOfBirth": "2008-11-12",
  "streamId": 1
}
```
- [ ] **Expected Status:** 201
- [ ] **Verify Response Contains:**
  - [ ] Student ID
  - [ ] All provided fields
  - [ ] Stream details (nested)
  - [ ] Empty scores array
  - [ ] Timestamps (createdAt, updatedAt)
- [ ] **Save student ID for subsequent tests**

---

### Test 2: Get All Students (GET)
- [ ] **URL:** `GET http://localhost:5000/api/students`
- [ ] **Expected Status:** 200
- [ ] **Verify Response:**
  - [ ] Returns array of students
  - [ ] Each student has stream information (nested)
  - [ ] Each student has scores array (may be empty)
  - [ ] Includes all student fields

---

### Test 3: Get Student by ID (GET)
- [ ] **URL:** `GET http://localhost:5000/api/students/{id}` (use ID from Test 1)
- [ ] **Expected Status:** 200
- [ ] **Verify Response:**
  - [ ] Single student object returned
  - [ ] Student ID matches requested ID
  - [ ] Stream information populated
  - [ ] Scores array present

---

### Test 4: Get Students by Stream (GET)
- [ ] **URL:** `GET http://localhost:5000/api/students/stream/1`
- [ ] **Expected Status:** 200
- [ ] **Verify Response:**
  - [ ] Returns array of students
  - [ ] All returned students have stream_id = 1
  - [ ] Stream details match the requested stream
  - [ ] May return empty array if no students in stream

---

### Test 5: Update Student Info (PUT)
- [ ] **URL:** `PUT http://localhost:5000/api/students/{id}` (use ID from Test 1)
- [ ] **Body:**
```json
{
  "firstName": "Michael James",
  "email": "michael.james.brown@example.com"
}
```
- [ ] **Expected Status:** 200
- [ ] **Verify Response:**
  - [ ] Updated fields reflected in response
  - [ ] Other fields unchanged
  - [ ] updatedAt timestamp changed
  - [ ] createdAt timestamp unchanged

---

### Test 6: Re-assign Student to Different Stream (PUT)
- [ ] **URL:** `PUT http://localhost:5000/api/students/{id}`
- [ ] **Body:**
```json
{
  "streamId": 2
}
```
- [ ] **Expected Status:** 200
- [ ] **Verify Response:**
  - [ ] Stream ID changed to 2
  - [ ] New stream details populated
  - [ ] Student successfully reassigned

---

### Test 7: Validation Error - Missing Required Field (POST)
- [ ] **URL:** `POST http://localhost:5000/api/students`
- [ ] **Body:**
```json
{
  "registrationNumber": "STU008",
  "firstName": "Test",
  "lastName": "User"
}
```
- [ ] **Expected Status:** 400
- [ ] **Verify Response:**
  - [ ] success = false
  - [ ] Contains validation error messages
  - [ ] Points out missing email and other fields

---

### Test 8: Validation Error - Invalid Email (POST)
- [ ] **URL:** `POST http://localhost:5000/api/students`
- [ ] **Body:**
```json
{
  "registrationNumber": "STU009",
  "firstName": "Test",
  "lastName": "User",
  "email": "invalid-email-format",
  "dateOfBirth": "2008-05-15",
  "streamId": 1
}
```
- [ ] **Expected Status:** 400
- [ ] **Verify Response:**
  - [ ] Error message indicates invalid email format

---

### Test 9: Validation Error - Field Length (POST)
- [ ] **URL:** `POST http://localhost:5000/api/students`
- [ ] **Body:**
```json
{
  "registrationNumber": "ST",
  "firstName": "A",
  "lastName": "User",
  "email": "test@example.com",
  "dateOfBirth": "2008-05-15",
  "streamId": 1
}
```
- [ ] **Expected Status:** 400
- [ ] **Verify Response:**
  - [ ] Error messages about minimum character lengths

---

### Test 10: Duplicate Registration Number (POST)
- [ ] **URL:** `POST http://localhost:5000/api/students`
- [ ] **Body:**
```json
{
  "registrationNumber": "STU007",
  "firstName": "Duplicate",
  "lastName": "User",
  "email": "duplicate@example.com",
  "dateOfBirth": "2008-05-15",
  "streamId": 1
}
```
- [ ] **Expected Status:** 409 or 400
- [ ] **Verify Response:**
  - [ ] Error indicates duplicate registration number

---

### Test 11: Duplicate Email (POST)
- [ ] **URL:** `POST http://localhost:5000/api/students`
- [ ] **Body:**
```json
{
  "registrationNumber": "STU010",
  "firstName": "Duplicate",
  "lastName": "Email",
  "email": "michael.james.brown@example.com",
  "dateOfBirth": "2008-05-15",
  "streamId": 1
}
```
- [ ] **Expected Status:** 409 or 400
- [ ] **Verify Response:**
  - [ ] Error indicates duplicate email

---

### Test 12: Student Not Found (GET)
- [ ] **URL:** `GET http://localhost:5000/api/students/99999`
- [ ] **Expected Status:** 404
- [ ] **Verify Response:**
  - [ ] success = false
  - [ ] Message: "Student not found"

---

### Test 13: Invalid Stream Assignment (POST)
- [ ] **URL:** `POST http://localhost:5000/api/students`
- [ ] **Body:**
```json
{
  "registrationNumber": "STU011",
  "firstName": "Test",
  "lastName": "User",
  "email": "test.invalid.stream@example.com",
  "dateOfBirth": "2008-05-15",
  "streamId": 99999
}
```
- [ ] **Expected Status:** 400 or 500 (depending on FK constraint)
- [ ] **Verify Response:**
  - [ ] Error indicates invalid stream

---

### Test 14: Update with No Fields (PUT)
- [ ] **URL:** `PUT http://localhost:5000/api/students/{id}`
- [ ] **Body:**
```json
{}
```
- [ ] **Expected Status:** 400
- [ ] **Verify Response:**
  - [ ] Error indicates at least one field required

---

### Test 15: Delete Student (DELETE)
- [ ] **URL:** `DELETE http://localhost:5000/api/students/{id}` (use ID from Test 1)
- [ ] **Expected Status:** 200
- [ ] **Verify Response:**
  - [ ] success = true
  - [ ] Message: "Student deleted successfully"
  - [ ] data: null

---

### Test 16: Verify Deletion (GET)
- [ ] **URL:** `GET http://localhost:5000/api/students/{id}` (same ID from Test 15)
- [ ] **Expected Status:** 404
- [ ] **Verify Response:**
  - [ ] Student not found message

---

## Validation Rules Testing Matrix

| Rule | Test Value | Expected Result |
|------|-----------|-----------------|
| registrationNumber required | null | 400 error |
| registrationNumber min length | "ST" | 400 error |
| registrationNumber max length | 51 chars | 400 error |
| firstName required | null | 400 error |
| firstName min length | "A" | 400 error |
| firstName max length | 101 chars | 400 error |
| lastName required | null | 400 error |
| lastName min length | "A" | 400 error |
| lastName max length | 101 chars | 400 error |
| email required | null | 400 error |
| email format | "invalid" | 400 error |
| dateOfBirth required | null | 400 error |
| dateOfBirth format | "invalid-date" | 400 error |
| streamId required | null | 400 error |
| streamId type | "string" | 400 error |
| registrationNumber unique | duplicate | 409 error |
| email unique | duplicate | 409 error |

---

## SQL Queries Verification

Verify the following SQL operations are working:

1. **INSERT (Create):**
   - [ ] Registration number constraint enforced
   - [ ] Email unique constraint enforced
   - [ ] FK constraint on stream_id enforced
   - [ ] Timestamps auto-set

2. **SELECT (Read):**
   - [ ] Students retrieved with stream JOIN
   - [ ] Scores properly nested via separate query
   - [ ] Filter by stream_id returns correct students
   - [ ] Single student retrieval works

3. **UPDATE (Modify):**
   - [ ] Partial updates work (not all fields required)
   - [ ] Stream reassignment works
   - [ ] Updated_at timestamp changes

4. **DELETE (Remove):**
   - [ ] Student deleted successfully
   - [ ] Cascade delete removes related scores
   - [ ] FK constraints prevent orphaned records

---

## Stream Assignment Feature Tests

- [ ] Student can be assigned to any valid stream on creation
- [ ] Student can be reassigned to different stream via update
- [ ] Stream details are populated in response
- [ ] Invalid stream ID is rejected
- [ ] Deleting a stream cascades to delete/orphan students

---

## Database Integrity Checks

- [ ] registration_number uniqueness enforced at DB level
- [ ] email uniqueness enforced at DB level
- [ ] stream_id FK constraint enforced
- [ ] NULL values prevented for required fields
- [ ] Timestamps properly managed (created_at, updated_at)
- [ ] Data types correct (TEXT, DATE, INTEGER)

---

## Response Format Validation

All responses must follow:
```json
{
  "success": boolean,
  "message": "string",
  "data": object | array | null,
  "error": null | string | array
}
```

- [ ] Successful responses have success: true
- [ ] Error responses have success: false
- [ ] Data field contains response payload
- [ ] Messages are descriptive and helpful

---

## Performance Notes

- [ ] Get all students completes in reasonable time
- [ ] Stream-filtered query performs efficiently
- [ ] No N+1 query issues (scores loaded in single query per request)
- [ ] Database connections properly managed

---

## Notes

- Registration numbers are case-sensitive
- Email addresses should be unique and valid
- Students must be assigned to a stream on creation
- All dates should be in ISO 8601 format (YYYY-MM-DD)
- Timestamps are stored in UTC (TIMESTAMPTZ)
- Stream reassignment is allowed and updates FK relationship
