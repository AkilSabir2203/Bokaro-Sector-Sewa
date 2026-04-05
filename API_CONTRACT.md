# Bokaro Sector-Sewak Backend API Contract

Base URL: `http://localhost:5000/api`

## Public Endpoints

### 1) Health
- Method: `GET`
- URL: `/health`
- Response:
```json
{
  "success": true,
  "message": "Bokaro Sector-Sewak backend is running."
}
```

### 2) Create Complaint (Resident)
- Method: `POST`
- URL: `/complaints`
- Request Body:
```json
{
  "quarterNumber": "QTR-4-C-105",
  "sector": 4,
  "category": "Plumbing",
  "description": "Water leakage in bathroom pipe",
  "priority": "High",
  "contactNumber": "9876543210"
}
```
- Response:
```json
{
  "success": true,
  "message": "Complaint created successfully.",
  "data": {
    "complaintId": "SEC4-001"
  }
}
```

### 3) Track Complaint Status (Resident)
- Method: `GET`
- URL: `/complaints/:complaintId`
- Example: `/complaints/SEC4-001`

## Admin Auth Endpoints

### 4) Register Admin (One-time setup)
- Method: `POST`
- URL: `/admin/auth/register`
- Request Body:
```json
{
  "setupKey": "change_me_admin_setup_key",
  "name": "Maintenance Inspector",
  "email": "inspector@bokarosewa.in",
  "password": "StrongPassword123"
}
```

### 5) Login Admin
- Method: `POST`
- URL: `/admin/auth/login`
- Request Body:
```json
{
  "email": "inspector@bokarosewa.in",
  "password": "StrongPassword123"
}
```
- Response includes `token`.

### 6) Admin Profile
- Method: `GET`
- URL: `/admin/auth/me`
- Header: `Authorization: Bearer <token>`

## Admin Dashboard Endpoints (Protected)

### 7) List Complaints with Pagination
- Method: `GET`
- URL: `/complaints?page=1&limit=20&status=Pending&priority=High&sector=4&search=leak`
- Header: `Authorization: Bearer <token>`

### 8) Update Complaint Status
- Method: `PATCH`
- URL: `/complaints/:complaintId/status`
- Header: `Authorization: Bearer <token>`
- Request Body:
```json
{
  "status": "Assigned",
  "assignedTo": "Plumber Team A"
}
```

### 9) Dashboard Summary Analytics
- Method: `GET`
- URL: `/admin/dashboard/summary`
- Header: `Authorization: Bearer <token>`

## Frontend Token Handling (React)
- Store JWT in memory or localStorage.
- Add Axios interceptor to attach token:
```js
config.headers.Authorization = `Bearer ${token}`;
```
- On `401`, redirect user to admin login page.
