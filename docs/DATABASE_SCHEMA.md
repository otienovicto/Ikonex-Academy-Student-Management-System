# Database Schema

## Tables

### Streams
- `id` (INT, Primary Key)
- `name` (VARCHAR, Unique)
- `code` (VARCHAR, Unique)
- `description` (TEXT)
- `createdAt` (DATETIME)
- `updatedAt` (DATETIME)

### Students
- `id` (INT, Primary Key)
- `registrationNumber` (VARCHAR, Unique)
- `firstName` (VARCHAR)
- `lastName` (VARCHAR)
- `email` (VARCHAR, Unique)
- `dateOfBirth` (DATE)
- `streamId` (INT, Foreign Key)
- `createdAt` (DATETIME)
- `updatedAt` (DATETIME)

### Subjects
- `id` (INT, Primary Key)
- `name` (VARCHAR)
- `code` (VARCHAR, Unique)
- `streamId` (INT, Foreign Key)
- `createdAt` (DATETIME)
- `updatedAt` (DATETIME)

### Scores
- `id` (INT, Primary Key)
- `studentId` (INT, Foreign Key)
- `subjectId` (INT, Foreign Key)
- `marks` (FLOAT)
- `assessmentType` (VARCHAR)
- `createdAt` (DATETIME)
- `updatedAt` (DATETIME)

## Relationships
- Stream (1) → (Many) Students
- Stream (1) → (Many) Subjects
- Student (1) → (Many) Scores
- Subject (1) → (Many) Scores
