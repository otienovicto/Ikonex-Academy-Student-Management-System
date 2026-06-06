# Phase 4: Stream Module - Testing Checklist

## Prerequisites
- Backend server running: `npm run dev` from `backend/` folder
- PostgreSQL database created and schema initialized
- Postman installed (or similar API testing tool)
- Base URL: `http://localhost:5000`

## Test Cases

### Test 1: Create Stream (POST)
- [ ] **URL:** `http://localhost:5000/api/streams`
- [ ] **Method:** POST
- [ ] **Body (JSON):**
```json
{
  "name": "Class 10A",
  "code": "SCI10A",
  "description": "Science Stream - Class 10A"
}
```
- [ ] **Expected Status:** 201
- [ ] **Expected Response:** Contains created stream with ID
- [ ] **Note:** Save the returned `id` for subsequent tests

---

### Test 2: Get All Streams (GET)
- [ ] **URL:** `http://localhost:5000/api/streams`
- [ ] **Method:** GET
- [ ] **Expected Status:** 200
- [ ] **Expected Response:** Array of all streams with students and subjects

---

### Test 3: Get Single Stream (GET)
- [ ] **URL:** `http://localhost:5000/api/streams/{id}` (use ID from Test 1)
- [ ] **Method:** GET
- [ ] **Expected Status:** 200
- [ ] **Expected Response:** Single stream object with nested students and subjects

---

### Test 4: Update Stream (PUT)
- [ ] **URL:** `http://localhost:5000/api/streams/{id}` (use ID from Test 1)
- [ ] **Method:** PUT
- [ ] **Body (JSON):**
```json
{
  "name": "Class 10A - Advanced",
  "description": "Updated science stream with advanced curriculum"
}
```
- [ ] **Expected Status:** 200
- [ ] **Expected Response:** Updated stream object with changes reflected

---

### Test 5: Validation Error Test (POST)
- [ ] **URL:** `http://localhost:5000/api/streams`
- [ ] **Method:** POST
- [ ] **Body (JSON - missing required field):**
```json
{
  "name": "Test Stream"
}
```
- [ ] **Expected Status:** 400
- [ ] **Expected Response:** Validation error with field details

---

### Test 6: Not Found Error Test (GET)
- [ ] **URL:** `http://localhost:5000/api/streams/99999` (non-existent ID)
- [ ] **Method:** GET
- [ ] **Expected Status:** 404
- [ ] **Expected Response:** "Stream not found" error message

---

### Test 7: Delete Stream (DELETE)
- [ ] **URL:** `http://localhost:5000/api/streams/{id}` (use ID from Test 1)
- [ ] **Method:** DELETE
- [ ] **Expected Status:** 200
- [ ] **Expected Response:** Success message "Stream deleted successfully"

---

### Test 8: Verify Deletion (GET)
- [ ] **URL:** `http://localhost:5000/api/streams/{id}` (same ID from Test 7)
- [ ] **Method:** GET
- [ ] **Expected Status:** 404
- [ ] **Expected Response:** "Stream not found" error message

---

## Validation Rules Tested

| Rule | Test Input | Expected Behavior |
|------|-----------|-------------------|
| Name required | Empty/null | 400 error |
| Name length | Less than 2 chars | 400 error |
| Name length | More than 100 chars | 400 error |
| Code required | Empty/null | 400 error |
| Code length | Less than 2 chars | 400 error |
| Code length | More than 20 chars | 400 error |
| Code format | Lowercase input | Auto-converted to uppercase |
| Description | Valid string | Accepted (optional) |
| Description length | More than 500 chars | 400 error |
| Unknown fields | Extra fields sent | Rejected (unknown fields not allowed) |

---

## Response Format Validation

Verify all responses follow this structure:
```json
{
  "success": true/false,
  "message": "string",
  "data": {}
}
```

---

## Notes
- SQL queries are using parameterized queries (`$1`, `$2`, etc.) to prevent SQL injection
- All timestamps are in UTC format (TIMESTAMPTZ)
- Unique constraints on `name` and `code` in database will prevent duplicates
- Cascade delete ensures related student records are handled safely
