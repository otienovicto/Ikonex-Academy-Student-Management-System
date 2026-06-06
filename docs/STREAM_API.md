# Stream API Endpoints Documentation

## Base URL
```
http://localhost:5000/api/streams
```

## Endpoints

### 1. Get All Streams
**Endpoint:** `GET /api/streams`

**Description:** Retrieve all class streams with their associated students and subjects.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "name": "Class 10A",
      "code": "SCI10A",
      "description": "Science Stream - Class 10A",
      "students": [
        {
          "id": 1,
          "registrationNumber": "STU001",
          "firstName": "John",
          "lastName": "Doe",
          "email": "john.doe@example.com",
          "dateOfBirth": "2008-05-15",
          "createdAt": "2024-06-04T10:30:00Z",
          "updatedAt": "2024-06-04T10:30:00Z"
        }
      ],
      "subjects": [
        {
          "id": 1,
          "name": "Mathematics",
          "code": "MATH101",
          "createdAt": "2024-06-04T10:30:00Z",
          "updatedAt": "2024-06-04T10:30:00Z"
        }
      ],
      "createdAt": "2024-06-04T10:30:00Z",
      "updatedAt": "2024-06-04T10:30:00Z"
    }
  ]
}
```

---

### 2. Get Stream by ID
**Endpoint:** `GET /api/streams/:id`

**Description:** Retrieve a specific stream by its ID with associated students and subjects.

**Parameters:**
- `id` (path) - Stream ID (required, integer)

**Example Request:**
```
GET /api/streams/1
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": 1,
    "name": "Class 10A",
    "code": "SCI10A",
    "description": "Science Stream - Class 10A",
    "students": [],
    "subjects": [],
    "createdAt": "2024-06-04T10:30:00Z",
    "updatedAt": "2024-06-04T10:30:00Z"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Stream not found",
  "error": null
}
```

---

### 3. Create Stream
**Endpoint:** `POST /api/streams`

**Description:** Create a new class stream.

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Class 11A",
  "code": "SCI11A",
  "description": "Science Stream - Class 11A"
}
```

**Validation Rules:**
- `name` (required): string, 2-100 characters
- `code` (required): string, 2-20 characters, converted to uppercase
- `description` (optional): string, max 500 characters

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Stream created successfully",
  "data": {
    "id": 5,
    "name": "Class 11A",
    "code": "SCI11A",
    "description": "Science Stream - Class 11A",
    "students": [],
    "subjects": [],
    "createdAt": "2024-06-04T10:45:00Z",
    "updatedAt": "2024-06-04T10:45:00Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation error",
  "error": [
    "Stream name is required",
    "Stream code is required"
  ]
}
```

---

### 4. Update Stream
**Endpoint:** `PUT /api/streams/:id`

**Description:** Update an existing stream.

**Parameters:**
- `id` (path) - Stream ID (required, integer)

**Request Headers:**
```
Content-Type: application/json
```

**Request Body (at least one field required):**
```json
{
  "name": "Class 10A - Updated",
  "code": "SCI10A",
  "description": "Updated description"
}
```

**Validation Rules:**
- At least one field must be provided
- `name`: string, 2-100 characters
- `code`: string, 2-20 characters, converted to uppercase
- `description`: string, max 500 characters

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Stream updated successfully",
  "data": {
    "id": 1,
    "name": "Class 10A - Updated",
    "code": "SCI10A",
    "description": "Updated description",
    "students": [],
    "subjects": [],
    "createdAt": "2024-06-04T10:30:00Z",
    "updatedAt": "2024-06-04T10:50:00Z"
  }
}
```

---

### 5. Delete Stream
**Endpoint:** `DELETE /api/streams/:id`

**Description:** Delete a stream by its ID. Associated students and subjects relationships will be cascaded.

**Parameters:**
- `id` (path) - Stream ID (required, integer)

**Example Request:**
```
DELETE /api/streams/5
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Stream deleted successfully",
  "data": null
}
```

---

## Testing in Postman

### Setup Steps

1. **Import Collection:**
   - Create a new Postman collection named "Student Management System"
   - Create a new environment variable:
     - `base_url` = `http://localhost:5000`
     - `stream_id` = `1`

2. **Create Requests:**

   **Request 1: Get All Streams**
   - Method: `GET`
   - URL: `{{base_url}}/api/streams`

   **Request 2: Get Stream by ID**
   - Method: `GET`
   - URL: `{{base_url}}/api/streams/{{stream_id}}`

   **Request 3: Create Stream**
   - Method: `POST`
   - URL: `{{base_url}}/api/streams`
   - Body (raw JSON):
   ```json
   {
     "name": "Class 12A",
     "code": "SCI12A",
     "description": "Science Stream - Class 12A"
   }
   ```

   **Request 4: Update Stream**
   - Method: `PUT`
   - URL: `{{base_url}}/api/streams/{{stream_id}}`
   - Body (raw JSON):
   ```json
   {
     "name": "Class 10A - Modified",
     "description": "Updated science stream"
   }
   ```

   **Request 5: Delete Stream**
   - Method: `DELETE`
   - URL: `{{base_url}}/api/streams/{{stream_id}}`

### Test Execution Order
1. Get All Streams → Identify a stream ID
2. Get Stream by ID → Test retrieval
3. Create Stream → Add new stream
4. Update Stream → Modify created stream
5. Delete Stream → Remove stream

---

## Error Codes

| Code | Message | Cause |
|------|---------|-------|
| 200 | Success | Request processed successfully |
| 201 | Stream created successfully | Stream created with valid data |
| 400 | Validation error | Invalid or missing required fields |
| 404 | Stream not found | Stream ID does not exist |
| 500 | Internal Server Error | Unexpected server error |
