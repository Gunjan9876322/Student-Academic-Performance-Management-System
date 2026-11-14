# Student Academic Performance Management System (SAPMS)
Individual Practical 12 project — MERN stack prototype.

## Features
- JWT-based login with Admin, Faculty and Student roles
- Student CRUD
- Attendance entry and attendance percentage
- Marks entry and result calculation
- Student dashboard endpoints / simple React dashboard

## Requirements
- Node.js 18+
- MongoDB Community Server or MongoDB Atlas
- npm

## Run backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```
Edit `.env` and set `MONGO_URI` and `JWT_SECRET`. Create first admin using the seed command:
```bash
npm run seed
```
API runs at http://localhost:5000. Health endpoint: `/api/health`.

## Run frontend (new terminal)
```bash
cd frontend
npm install
npm run dev
```
Open the Vite URL printed in terminal. Login with seeded admin credentials (change these in `backend/seed.js` before seeding).

## Main API
- POST `/api/auth/login`
- GET/POST `/api/students`
- GET/PUT/DELETE `/api/students/:id`
- GET/POST `/api/attendance`
- GET/POST `/api/marks`
- GET `/api/reports/student/:studentId`

All protected routes require `Authorization: Bearer <token>`.
## Notes
This is a classroom MVP scaffold. Configure a real deployment, HTTPS, backups, input validation, audit logging and stronger account provisioning before production use.
