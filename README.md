# Bokaro Sector-Sewak

Township Quarter Maintenance and Complaint Management System for SAIL Quarters in Bokaro Steel City.

This project is a full-stack MERN application where:
- Residents can sign up, log in, register complaints, and check their own complaint status.
- Admins (Maintenance Inspectors) can log in and update complaint status.

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (authentication)
- bcryptjs (password hashing)
- dotenv

### Frontend
- React (Vite)
- Axios
- React Router DOM

## Project Structure

```text
Bokaro-sector-sewa/
|-- src/
|   |-- config/
|   |   `-- db.js
|   |-- controllers/
|   |   |-- adminController.js
|   |   |-- authController.js
|   |   `-- complaintController.js
|   |-- middlewares/
|   |   `-- authMiddleware.js
|   |-- models/
|   |   |-- Admin.js
|   |   |-- User.js
|   |   `-- Complaint.js
|   |-- routes/
|   |   |-- adminRoutes.js
|   |   |-- authRoutes.js
|   |   `-- complaintRoutes.js
|   |-- seed.js
|   `-- server.js
|-- client/
|   |-- src/
|   `-- ...
|-- .env.example
|-- API_CONTRACT.md
`-- package.json
```

## Roles and Permissions

### Resident
- Signup and login
- Create complaint
- Check own complaint status
- Rule: only one active complaint allowed at a time
  - Active statuses: Pending, Assigned
  - New complaint is allowed only when previous complaint is Resolved or Rejected

### Admin
- Login only
- Update complaint status:
  - Pending -> Assigned
  - Pending -> Rejected
  - Assigned -> Resolved
  - Assigned -> Rejected

## Environment Variables

Create a `.env` file in project root.

Use this template:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_secret_key
```

Note: backend also supports `MONGO_URI` for compatibility.

## Installation

From project root:

```bash
npm install
```

Frontend dependencies:

```bash
cd client
npm install
```

## Run the Project

### 1. Start Backend

From project root:

```bash
npm run dev
```

Backend runs on: `http://localhost:5000`

### 2. Start Frontend

In a new terminal:

```bash
cd client
npm run dev
```

Frontend runs on: `http://localhost:5173`

## Seed Default Admin

A seed script is included to create a default admin.

Run:

```bash
npm run seed
```

Default admin credentials:
- Email: akil@123
- Password: akil123

## Core API Routes

### Auth
- `POST /api/auth/signup` (resident only)
- `POST /api/auth/login` (resident and admin)

### Complaints (Resident)
- `POST /api/complaints` (resident only)
- `GET /api/complaints/my-status` (resident only)

### Complaints (Admin)
- `PATCH /api/admin/complaints/:id/status` (admin only)

### Health
- `GET /api/health`

## Authentication Flow

1. User/Admin logs in via `/api/auth/login`.
2. JWT token is returned.
3. Token is sent in `Authorization` header:

```http
Authorization: Bearer <token>
```

4. Backend middleware validates token and role before protected actions.

## Validation and Business Rules

- Complaint categories: Plumbing, Electrical, Carpentry
- Sector range: 1-12
- Priority: Low, Medium, High
- Status: Pending, Assigned, Resolved, Rejected
- Resident cannot create a new complaint if an active complaint already exists

## Notes

- If login fails for admin, run seed again and restart backend.
- If MongoDB connection fails, verify network/DNS and Atlas access settings.
- For API examples and payloads, see `API_CONTRACT.md`.

## Future Enhancements

- Email/SMS complaint notifications
- Admin analytics dashboard with charts
- Complaint attachments (images/documents)
- Sector-wise SLA and escalation flow
