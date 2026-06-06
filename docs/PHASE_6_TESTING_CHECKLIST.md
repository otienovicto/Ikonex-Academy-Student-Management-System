# Phase 6: Subject Management - Testing Checklist

## Manual Testing Guidelines

Use Postman or curl to test all endpoints. Ensure PostgreSQL is running and the backend is started with `npm run dev`.

---

## Test Cases

### Section 1: Subject CRUD Operations

#### Test 1.1: Create Subject (Valid Data)
- **Method:** POST `/api/subjects`
- **Request:**
  ```json
  {
    "name": "Mathematics",
    "code": "MATH101"
  }
  ```
- **Expected Status:** 201 Created
- **Expected Response:** Returns subject object with generated ID, timestamps
- **Verify:**
  - Response includes `success: true`
  - Subject has unique ID
  - `created_at` and `updated_at` are set
  - Code is stored correctly

#### Test 1.2: Create Subject (Name Too Short)
- **Method:** POST `/api/subjects`
- **Request:**
  ```json
  {
    "name": "M",
    "code": "MATH101"
  }
  ```
- **Expected Status:** 400 Bad Request
- **Expected Response:** Validation error
- **Verify:**
  - Error message indicates name must be at least 2 characters
  - Subject not created in database

#### Test 1.3: Create Subject (Name Too Long)
- **Method:** POST `/api/subjects`
- **Request:**
  ```json
  {
    "name": "This is an extremely long subject name that exceeds one hundred characters and should fail validation because of this",
    "code": "LONG001"
  }
  ```
- **Expected Status:** 400 Bad Request
- **Expected Response:** Validation error
- **Verify:**
  - Error message indicates name cannot exceed 100 characters

#### Test 1.4: Create Subject (Code Too Short)
- **Method:** POST `/api/subjects`
- **Request:**
  ```json
  {
    "name": "Physics",
    "code": "P"
  }
  ```
- **Expected Status:** 400 Bad Request
- **Expected Response:** Validation error
- **Verify:**
  - Error message indicates code must be at least 2 characters

#### Test 1.5: Create Subject (Code Too Long)
- **Method:** POST `/api/subjects`
- **Request:**
  ```json
  {
    "name": "Chemistry",
    "code": "CHEM10101010101010101"
  }
  ```
- **Expected Status:** 400 Bad Request
- **Expected Response:** Validation error
- **Verify:**
  - Error message indicates code cannot exceed 20 characters

#### Test 1.6: Create Subject (Duplicate Code)
- **Method:** POST `/api/subjects` (after Test 1.1)
- **Request:**
  ```json
  {
    "name": "Advanced Math",
    "code": "MATH101"
  }
  ```
- **Expected Status:** 409 Conflict
- **Expected Response:** Database constraint error
- **Verify:**
  - Error indicates code already exists
  - Only one record with code MATH101 exists in database

#### Test 1.7: Create Subject (Missing Name)
- **Method:** POST `/api/subjects`
- **Request:**
  ```json
  {
    "code": "ENG101"
  }
  ```
- **Expected Status:** 400 Bad Request
- **Expected Response:** Validation error
- **Verify:**
  - Error indicates name is required

#### Test 1.8: Create Subject (Unknown Fields)
- **Method:** POST `/api/subjects`
- **Request:**
  ```json
  {
    "name": "History",
    "code": "HIS101",
    "extraField": "should be rejected"
  }
  ```
- **Expected Status:** 400 Bad Request
- **Expected Response:** Validation error
- **Verify:**
  - Request rejected due to unknown field
  - Subject not created

#### Test 1.9: Get All Subjects
- **Method:** GET `/api/subjects`
- **Expected Status:** 200 OK
- **Verify:**
  - Returns array of subjects
  - Each subject includes id, name, code, streams, scores, timestamps
  - All previously created subjects are in the list

#### Test 1.10: Get Subject by ID
- **Method:** GET `/api/subjects/1`
- **Expected Status:** 200 OK
- **Expected Response:** Single subject object with full details
- **Verify:**
  - Correct subject returned
  - Includes nested streams array
  - Includes nested scores array

#### Test 1.11: Get Subject by ID (Invalid ID)
- **Method:** GET `/api/subjects/99999`
- **Expected Status:** 404 Not Found
- **Expected Response:** Error message "Subject not found"
- **Verify:**
  - Proper 404 response
  - No data returned

#### Test 1.12: Update Subject (Valid Name Change)
- **Method:** PUT `/api/subjects/1`
- **Request:**
  ```json
  {
    "name": "Advanced Mathematics"
  }
  ```
- **Expected Status:** 200 OK
- **Verify:**
  - Name updated in response
  - `updated_at` timestamp changed
  - `created_at` unchanged
  - Other fields preserved

#### Test 1.13: Update Subject (Valid Code Change)
- **Method:** PUT `/api/subjects/1`
- **Request:**
  ```json
  {
    "code": "MATH102"
  }
  ```
- **Expected Status:** 200 OK
- **Verify:**
  - Code updated
  - `updated_at` changed

#### Test 1.14: Update Subject (Invalid - Empty Request)
- **Method:** PUT `/api/subjects/1`
- **Request:**
  ```json
  {}
  ```
- **Expected Status:** 400 Bad Request
- **Expected Response:** Validation error
- **Verify:**
  - Error indicates at least one field must be provided
  - Subject not modified

#### Test 1.15: Update Subject (Invalid - Name Too Long)
- **Method:** PUT `/api/subjects/1`
- **Request:**
  ```json
  {
    "name": "This is an extremely long subject name that exceeds one hundred characters maximum allowed by validation rules"
  }
  ```
- **Expected Status:** 400 Bad Request
- **Verify:**
  - Validation error for name length

#### Test 1.16: Update Subject (Duplicate Code)
- **Method:** PUT `/api/subjects/2`
- **Request (given MATH101 already exists):**
  ```json
  {
    "code": "MATH101"
  }
  ```
- **Expected Status:** 409 Conflict
- **Expected Response:** Unique constraint violation
- **Verify:**
  - Subject 2 code not changed

#### Test 1.17: Update Subject by ID (Not Found)
- **Method:** PUT `/api/subjects/99999`
- **Request:**
  ```json
  {
    "name": "Nonexistent Subject"
  }
  ```
- **Expected Status:** 404 Not Found
- **Verify:**
  - Proper error response

#### Test 1.18: Delete Subject (Valid)
- **Method:** DELETE `/api/subjects/1`
- **Expected Status:** 200 OK
- **Expected Response:** Success message
- **Verify:**
  - Subject removed from database
  - All related stream_subjects records deleted (cascade)
  - All related assessments deleted (cascade)
  - GET /subjects/1 returns 404

#### Test 1.19: Delete Subject (Already Deleted)
- **Method:** DELETE `/api/subjects/1`
- **Expected Status:** 200 OK (implementation dependent - may be 404)
- **Verify:**
  - Idempotent behavior or clear error

---

### Section 2: Stream-Subject Relationships

#### Test 2.1: Assign Subject to Stream (Valid)
- **Prerequisites:** Subject ID 2 exists, Stream ID 1 exists
- **Method:** POST `/api/subjects/2/streams`
- **Request:**
  ```json
  {
    "streamId": 1
  }
  ```
- **Expected Status:** 201 Created
- **Expected Response:** Subject object with updated streams array
- **Verify:**
  - Stream appears in subject's streams array
  - Database record created in stream_subjects table
  - Relationship is bidirectional (can query by stream)

#### Test 2.2: Assign Subject to Stream (Duplicate)
- **Method:** POST `/api/subjects/2/streams` (after Test 2.1)
- **Request:**
  ```json
  {
    "streamId": 1
  }
  ```
- **Expected Status:** 409 Conflict
- **Expected Response:** Error "Subject is already assigned to this stream"
- **Verify:**
  - Duplicate assignment prevented
  - No duplicate records in stream_subjects table
  - Unique constraint enforced at database level

#### Test 2.3: Assign Subject to Multiple Streams
- **Prerequisites:** Subject ID 3, Streams ID 1, 2, 3 exist
- **Method:** POST `/api/subjects/3/streams`
- **Request 1:**
  ```json
  {
    "streamId": 1
  }
  ```
- **Request 2:**
  ```json
  {
    "streamId": 2
  }
  ```
- **Request 3:**
  ```json
  {
    "streamId": 3
  }
  ```
- **Expected Status:** 201 Created for each
- **Verify:**
  - All three streams appear in subject's streams array
  - Three records in stream_subjects table for this subject

#### Test 2.4: Assign Subject to Invalid Stream
- **Method:** POST `/api/subjects/2/streams`
- **Request:**
  ```json
  {
    "streamId": 99999
  }
  ```
- **Expected Status:** 400 Bad Request or database error
- **Verify:**
  - Foreign key constraint prevents invalid stream reference

#### Test 2.5: Assign Invalid Subject to Stream
- **Method:** POST `/api/subjects/99999/streams`
- **Request:**
  ```json
  {
    "streamId": 1
  }
  ```
- **Expected Status:** 404 Not Found (after assignment attempt)
- **Verify:**
  - Proper error response

#### Test 2.6: Get Subjects by Stream (Valid)
- **Method:** GET `/api/subjects/stream/1`
- **Expected Status:** 200 OK
- **Expected Response:** Array of subjects
- **Verify:**
  - All subjects assigned to stream 1 are returned
  - Each subject has id, name, code, createdAt, updatedAt
  - No nested streams/scores in this simplified view

#### Test 2.7: Get Subjects by Stream (Empty Stream)
- **Method:** GET `/api/subjects/stream/4` (assuming stream 4 has no subjects)
- **Expected Status:** 200 OK
- **Expected Response:** Empty array
- **Verify:**
  - Returns empty array (not an error)
  - Response is valid success response

#### Test 2.8: Get Subjects by Invalid Stream
- **Method:** GET `/api/subjects/stream/99999`
- **Expected Status:** 200 OK with empty array (or 404 depending on implementation)
- **Verify:**
  - Graceful handling of nonexistent stream

#### Test 2.9: Remove Subject from Stream (Valid)
- **Method:** DELETE `/api/subjects/2/streams/1`
- **Expected Status:** 200 OK
- **Expected Response:** Success message
- **Verify:**
  - Record deleted from stream_subjects table
  - Subject no longer appears in GET /subjects/stream/1
  - Subject still exists and can be retrieved by ID

#### Test 2.10: Remove Subject from Stream (Not Assigned)
- **Method:** DELETE `/api/subjects/2/streams/1` (after Test 2.9)
- **Expected Status:** 400 Bad Request
- **Expected Response:** Error "Subject is not assigned to this stream"
- **Verify:**
  - Proper error handling
  - No database changes

#### Test 2.11: Remove Subject from Invalid Stream
- **Method:** DELETE `/api/subjects/2/streams/99999`
- **Expected Status:** 400 Bad Request
- **Expected Response:** Error message
- **Verify:**
  - Graceful error handling

---

### Section 3: Integration Tests

#### Test 3.1: Cascade Delete - Subject Deletion
- **Prerequisites:** Subject with assessments assigned to streams
- **Method:** DELETE `/api/subjects/5`
- **Verify:**
  - Subject deleted
  - All stream_subjects records deleted
  - All assessments records deleted
  - No orphaned records in database

#### Test 3.2: Query Subjects After Stream Operations
- **Sequence:**
  1. Create Subject A, B, C
  2. Create Stream 1, 2
  3. Assign A→1, B→1, C→2
  4. GET /subjects/stream/1
  5. Remove A from 1
  6. GET /subjects/stream/1
- **Verify:**
  - First query returns A, B
  - After removal, second query returns only B
  - A still exists globally

#### Test 3.3: Full Lifecycle Test
- **Sequence:**
  1. Create Subject "Biology"
  2. Verify it appears in GET all
  3. Assign to Stream 1
  4. Verify it appears in GET /stream/1
  5. Update name to "Advanced Biology"
  6. Verify update reflected in all queries
  7. Assign to Stream 2
  8. Verify in both streams
  9. Remove from Stream 1
  10. Verify only in Stream 2
  11. Delete subject
  12. Verify removed from all queries
- **Expected:** All operations succeed as expected

---

### Section 4: Field Validation Matrix

#### Name Field Validation

| Input | Length | Valid | Expected Result |
|-------|--------|-------|-----------------|
| "M" | 1 | No | 400 Bad Request |
| "MA" | 2 | Yes | 201 Created |
| "Mathematics" | 11 | Yes | 201 Created |
| "A" * 100 | 100 | Yes | 201 Created |
| "A" * 101 | 101 | No | 400 Bad Request |
| "" | 0 | No | 400 Bad Request |
| null | - | No | 400 Bad Request |
| undefined | - | No | 400 Bad Request |
| "  Math  " | - | Yes* | 201 Created (trimmed) |

*Expected behavior: trailing/leading spaces trimmed by Joi

#### Code Field Validation

| Input | Length | Valid | Expected Result |
|-------|--------|-------|-----------------|
| "M" | 1 | No | 400 Bad Request |
| "MA" | 2 | Yes | 201 Created |
| "MATH101" | 7 | Yes | 201 Created |
| "A" * 20 | 20 | Yes | 201 Created |
| "A" * 21 | 21 | No | 400 Bad Request |
| "" | 0 | No | 400 Bad Request |
| null | - | No | 400 Bad Request |
| "DUPLICATE" | - | No | 409 Conflict (if exists) |
| "  CODE  " | - | Yes* | 201 Created (trimmed) |

*Expected behavior: trailing/leading spaces trimmed

#### StreamId Field Validation (for assignment)

| Input | Type | Valid | Expected Result |
|-------|------|-------|-----------------|
| 1 | integer | Yes | 201 Created |
| "1" | string | Yes | 201 Accepted (coerced) |
| 0 | integer | Yes* | 201 or 400 (depends on FK) |
| -1 | integer | No* | 400 or error |
| 99999 | integer | No | FK constraint error |
| null | - | No | 400 Bad Request |
| "abc" | string | No | 400 Bad Request |

*Behavior depends on database implementation

---

### Section 5: Response Format Validation

#### Test 5.1: Success Response Format
- **Any successful request**
- **Verify all responses follow format:**
  ```json
  {
    "success": true,
    "message": "descriptive message",
    "data": { /* actual data */ },
    "error": null
  }
  ```

#### Test 5.2: Error Response Format
- **Any failed request**
- **Verify error response format:**
  ```json
  {
    "success": false,
    "message": "error description",
    "data": null,
    "error": "error details"
  }
  ```

#### Test 5.3: Status Code Consistency
- **Verify HTTP status codes:**
  - 200 OK for successful GET, PUT, DELETE
  - 201 Created for successful POST (create and assign)
  - 400 Bad Request for validation errors
  - 404 Not Found for missing resources
  - 409 Conflict for constraint violations

---

## Database Verification

### SQL Queries for Manual Verification

#### Verify Subject Created
```sql
SELECT * FROM subjects WHERE code = 'MATH101';
```

#### Verify Stream-Subject Assignment
```sql
SELECT ss.*, s.name, cs.name 
FROM stream_subjects ss
JOIN subjects s ON ss.subject_id = s.id
JOIN class_streams cs ON ss.stream_id = cs.id
WHERE s.id = 2;
```

#### Verify Unique Constraint on Code
```sql
SELECT code, COUNT(*) FROM subjects GROUP BY code HAVING COUNT(*) > 1;
-- Should return empty result set
```

#### Verify Unique Constraint on Stream-Subject
```sql
SELECT stream_id, subject_id, COUNT(*) 
FROM stream_subjects 
GROUP BY stream_id, subject_id 
HAVING COUNT(*) > 1;
-- Should return empty result set
```

#### Verify Cascade Delete
```sql
-- After deleting a subject, verify no orphaned records
SELECT * FROM stream_subjects WHERE subject_id = 1;
SELECT * FROM assessments WHERE subject_id = 1;
-- Both should be empty
```

---

## Performance Considerations

- **Index Verification:** Verify indexes exist on foreign keys
  ```sql
  SELECT * FROM pg_indexes WHERE tablename = 'stream_subjects';
  ```
- **Query Performance:** Test queries with large datasets (100+ subjects, 20+ streams)
- **Cascade Operations:** Monitor performance when deleting subjects with many assessments

---

## Summary Checklist

- [ ] All CRUD operations tested (19 tests)
- [ ] Stream-subject relationships tested (11 tests)
- [ ] Integration scenarios tested (3 tests)
- [ ] Field validation matrix completed
- [ ] Response format validation passed
- [ ] Database constraints verified
- [ ] Cascade delete operations verified
- [ ] Error handling tested
- [ ] Status codes match expectations
- [ ] All edge cases covered

**Total Test Cases:** 33+ manual tests + database verification
