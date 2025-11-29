# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register User
**POST** `/api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "employee" // or "manager"
}
```

**Response:**
```json
{
  "msg": "ok"
}
```

**Status Codes:**
- `200` - Success
- `400` - Validation error or user already exists

---

### Login
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "employee",
  "name": "John Doe"
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid credentials

---

### Get Current User (Optional)
**GET** `/api/auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "employee"
}
```

---

## Leave Management Endpoints

### Apply for Leave
**POST** `/api/leaves`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "leaveType": "sick", // "sick", "casual", or "vacation"
  "startDate": "2024-01-15",
  "endDate": "2024-01-20",
  "reason": "Medical appointment",
  "totalDays": 6
}
```

**Response:**
```json
{
  "_id": "leave_id",
  "userId": "user_id",
  "leaveType": "sick",
  "startDate": "2024-01-15T00:00:00.000Z",
  "endDate": "2024-01-20T00:00:00.000Z",
  "reason": "Medical appointment",
  "totalDays": 6,
  "status": "pending",
  "createdAt": "2024-01-10T10:00:00.000Z"
}
```

**Status Codes:**
- `200` - Success
- `400` - Validation error
- `401` - Unauthorized

---

### Get My Leave Requests
**GET** `/api/leaves/my-requests`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "_id": "leave_id",
    "userId": "user_id",
    "leaveType": "sick",
    "startDate": "2024-01-15T00:00:00.000Z",
    "endDate": "2024-01-20T00:00:00.000Z",
    "reason": "Medical appointment",
    "totalDays": 6,
    "status": "approved",
    "createdAt": "2024-01-10T10:00:00.000Z"
  }
]
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized

---

### Get Leave Statistics
**GET** `/api/leaves/statistics`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "totalApplied": 26,
  "totalApproved": 20,
  "totalRejected": 5,
  "totalPending": 1,
  "totalRequests": 5
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `500` - Server error

---

### Cancel Leave Request
**DELETE** `/api/leaves/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "msg": "Leave request cancelled successfully"
}
```

**Status Codes:**
- `200` - Success
- `403` - Forbidden (not your request)
- `404` - Request not found
- `401` - Unauthorized

---

### Get Pending Requests (Manager Only)
**GET** `/api/leaves/pending`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "_id": "leave_id",
    "userId": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "leaveType": "sick",
    "startDate": "2024-01-15T00:00:00.000Z",
    "endDate": "2024-01-20T00:00:00.000Z",
    "reason": "Medical appointment",
    "totalDays": 6,
    "status": "pending",
    "createdAt": "2024-01-10T10:00:00.000Z"
  }
]
```

**Status Codes:**
- `200` - Success
- `403` - Forbidden (not a manager)
- `401` - Unauthorized

---

### Approve Leave Request (Manager Only)
**PUT** `/api/leaves/:id/approve`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{}
```

**Response:**
```json
{
  "_id": "leave_id",
  "userId": "user_id",
  "leaveType": "sick",
  "startDate": "2024-01-15T00:00:00.000Z",
  "endDate": "2024-01-20T00:00:00.000Z",
  "reason": "Medical appointment",
  "totalDays": 6,
  "status": "approved",
  "createdAt": "2024-01-10T10:00:00.000Z"
}
```

**Status Codes:**
- `200` - Success
- `400` - Request is not pending
- `403` - Forbidden (not a manager)
- `404` - Request not found
- `401` - Unauthorized

---

### Reject Leave Request (Manager Only)
**PUT** `/api/leaves/:id/reject`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{}
```

**Response:**
```json
{
  "_id": "leave_id",
  "userId": "user_id",
  "leaveType": "sick",
  "startDate": "2024-01-15T00:00:00.000Z",
  "endDate": "2024-01-20T00:00:00.000Z",
  "reason": "Medical appointment",
  "totalDays": 6,
  "status": "rejected",
  "createdAt": "2024-01-10T10:00:00.000Z"
}
```

**Status Codes:**
- `200` - Success
- `400` - Request is not pending
- `403` - Forbidden (not a manager)
- `404` - Request not found
- `401` - Unauthorized

---

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message description"
}
```

**Common Status Codes:**
- `400` - Bad Request (validation errors, missing fields)
- `401` - Unauthorized (invalid or missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

---

## Data Models

### User Model
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String ("employee" | "manager")
}
```

### Leave Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  leaveType: String ("sick" | "casual" | "vacation"),
  startDate: Date,
  endDate: Date,
  totalDays: Number,
  reason: String,
  status: String ("pending" | "approved" | "rejected"),
  createdAt: Date
}
```

---

## Example Usage

### Using cURL

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

**Apply for Leave:**
```bash
curl -X POST http://localhost:5000/api/leaves \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "leaveType": "sick",
    "startDate": "2024-01-15",
    "endDate": "2024-01-20",
    "reason": "Medical appointment",
    "totalDays": 6
  }'
```

**Get Statistics:**
```bash
curl -X GET http://localhost:5000/api/leaves/statistics \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Rate Limiting

Currently, there is no rate limiting implemented. For production, consider adding rate limiting middleware.

## Security Notes

- All passwords are hashed using bcrypt
- JWT tokens expire (consider adding expiration in production)
- CORS is enabled for development
- Input validation is performed on the server side

