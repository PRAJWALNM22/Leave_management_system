# Leave Management System

A modern, full-stack leave management application built with React, Node.js, Express, and MongoDB. Employees can apply for leave and managers can review and approve/reject requests.

## 🚀 Features

**Employee Features:**
- User authentication (login/register)
- Apply for leave with dates and reason
- View leave statistics (applied, approved, rejected, pending)
- View and cancel own leave requests

**Manager Features:**
- View pending requests count on dashboard
- Review and approve/reject leave requests
- See employee details for each request

**UI/UX:**
- Modern, responsive design
- Custom confirmation modals
- Toast notifications
- Real-time statistics updates

## 📋 Prerequisites

- Node.js (v14+)
- npm (v6+)
- MongoDB (local or MongoDB Atlas)

## 🛠️ Setup

### 1. Clone Repository
```bash
git clone <your-repository-url>
cd leave-mgmt
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
MONGO_URI=mongodb://localhost:27017/leave-mgmt
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/leave-mgmt?retryWrites=true&w=majority

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Optional: Create `frontend/.env` to change API URL:
```env
VITE_API_BASE=http://localhost:5000/api
```

## 🚀 How to Run

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend runs on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:5173`

### Production Mode
```bash
# Build frontend
cd frontend
npm run build

# Start backend
cd backend
npm start
```

## 🔐 Environment Variables

**Backend (.env):**
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens (use strong random string)
- `PORT` - Server port (default: 5000)

**Frontend (.env) - Optional:**
- `VITE_API_BASE` - Backend API URL (default: http://127.0.0.1:5000/api)

## 🔌 API Endpoints

**Authentication:**
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

**Leave Management (Employee):**
- `POST /api/leaves` - Apply for leave
- `GET /api/leaves/my-requests` - Get own requests
- `GET /api/leaves/statistics` - Get statistics
- `DELETE /api/leaves/:id` - Cancel request

**Leave Management (Manager):**
- `GET /api/leaves/pending` - Get pending requests
- `PUT /api/leaves/:id/approve` - Approve request
- `PUT /api/leaves/:id/reject` - Reject request

## 📁 Project Structure

```
leave-mgmt/
├── backend/
│   ├── index.js           # Server entry point
│   ├── middleware/        # Auth middleware
│   ├── models/           # User & Leave models
│   ├── routes/           # API routes
│   └── .env              # Environment variables
│
└── frontend/
    ├── src/
    │   ├── components/   # Reusable components
    │   ├── pages/        # Page components
    │   ├── services/     # API service
    │   └── store/        # State management
    └── package.json
```

## 🧪 Testing

1. **Register as Employee:**
   - Go to Register page
   - Fill details, select "Employee" role
   - Register and login

2. **Register as Manager:**
   - Go to Register page
   - Fill details, select "Manager" role
   - Register and login

3. **Test Workflow:**
   - As Employee: Apply for leave → View requests → Check statistics
   - As Manager: View pending count → Review requests → Approve/Reject

## 🐛 Troubleshooting

**MongoDB Connection Error:**
- Check if MongoDB is running
- Verify connection string in `.env`
- For Atlas: Check IP whitelist

**Port Already in Use:**
- Change `PORT` in `.env`
- Or kill process using port 5000

**API Connection Error:**
- Verify backend is running
- Check `VITE_API_BASE` in frontend `.env`
- Check CORS settings

**Build Errors:**
- Delete `node_modules` and reinstall
- Clear npm cache: `npm cache clean --force`

## 📦 Technologies

**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Bcrypt  
**Frontend:** React, React Router, Vite, Axios, Zustand

## 🔒 Security

- JWT authentication
- Password hashing with Bcrypt
- Role-based access control
- Input validation
- CORS configuration

## 📄 License

Open source for educational purposes.

---

**Note:** Change `JWT_SECRET` to a strong random string in production. Use secure MongoDB connection string.
