# Deployment Guide

## Prerequisites
- Node.js v14 or higher
- MySQL 5.7 or higher
- npm or yarn

## Backend Deployment

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup Environment
Create `.env` file with:
```
NODE_ENV=production
PORT=5000
DATABASE_URL=mysql://user:password@localhost:3306/student_management
JWT_SECRET=your_secure_secret_key
API_URL=http://your-domain.com
```

### 3. Setup Database
```bash
npx prisma migrate deploy
npx prisma generate
```

### 4. Build and Start
```bash
npm run build
npm start
```

## Frontend Deployment

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Build
```bash
npm run build
```

### 3. Deploy
Deploy the `out` or `.next` directory to your hosting provider.

## Docker Deployment
Use the provided `docker-compose.yml` for containerized deployment:
```bash
docker-compose up -d
```
