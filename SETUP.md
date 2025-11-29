# Quick Setup Guide

## Step-by-Step Installation

### 1. Prerequisites Check
```bash
node --version  # Should be v14 or higher
npm --version   # Should be v6 or higher
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
# Copy the content below into a new file named .env
```

**Create `backend/.env` file:**
```env
MONGO_URI=mongodb://localhost:27017/leave-mgmt
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
PORT=5000
```

### 3. Frontend Setup

```bash
# From project root, navigate to frontend
cd frontend

# Install dependencies
npm install
```

### 4. Start MongoDB

**Option A: Local MongoDB**
```bash
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl start mongod
# or
brew services start mongodb-community
```

**Option B: MongoDB Atlas**
- Sign up at https://www.mongodb.com/cloud/atlas
- Create a free cluster
- Get connection string
- Update `MONGO_URI` in `.env`

### 5. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
✅ Backend running on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
✅ Frontend running on http://localhost:5173

### 6. Access the Application

Open your browser and go to: **http://localhost:5173**

## First Time Setup

1. **Register as Employee:**
   - Click "Create Account"
   - Fill in details
   - Select "Employee" role
   - Register and login

2. **Register as Manager:**
   - Click "Create Account" 
   - Fill in details
   - Select "Manager" role
   - Register and login

3. **Test the Flow:**
   - As Employee: Apply for leave
   - As Manager: Approve/Reject the request
   - Check statistics on dashboard

## Troubleshooting

**Backend won't start:**
- Check MongoDB is running
- Verify `.env` file exists in `backend/` folder
- Check if port 5000 is available

**Frontend won't start:**
- Delete `node_modules` and run `npm install` again
- Check if port 5173 is available

**Database connection error:**
- Verify MongoDB connection string
- Check MongoDB service is running
- For Atlas: Check IP whitelist and credentials

## Environment Variables Reference

### Backend (.env)
```
MONGO_URI=mongodb://localhost:27017/leave-mgmt
JWT_SECRET=your-secret-key-here
PORT=5000
```

### Frontend (.env) - Optional
```
VITE_API_BASE=http://localhost:5000/api
```

