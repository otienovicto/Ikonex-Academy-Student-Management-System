# System Design

## Architecture Overview

The Student Management System follows a modular monolithic architecture with clear separation of concerns.

### Backend Structure
- **Config**: Database, environment, and logger configuration
- **Modules**: Business logic organized by domain (students, streams, subjects, assessments, reports)
- **Middlewares**: Authentication, validation, and error handling
- **Utils**: Shared utilities like grade calculator and ranking engine
- **Prisma**: ORM for database operations

### Frontend Structure
- **Pages/App**: Route-specific components
- **Components**: Reusable UI components
- **Services**: API integration layer
- **Hooks**: React hooks for data fetching and state management
- **Context**: Global state management
- **Utils**: Helper functions

## Data Flow
1. Frontend sends request to API
2. Middleware validates request
3. Controller handles business logic
4. Service interacts with database
5. Response is formatted and sent back

## Key Features
- Student management
- Stream and subject organization
- Assessment scoring
- Report generation
- Grade calculation and ranking
