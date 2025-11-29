# Leave Management System - Project Summary

## Project Overview

A full-stack web application for managing employee leave requests. The system provides separate interfaces for employees to apply for leave and managers to review and approve/reject requests.

## Technology Stack

### Frontend
- **React 19.2.0** - UI library
- **React Router 7.9.6** - Client-side routing
- **Vite 7.2.4** - Build tool and dev server
- **Axios 1.13.2** - HTTP client
- **Zustand 5.0.8** - State management
- **CSS3** - Custom styling with CSS variables

### Backend
- **Node.js** - Runtime environment
- **Express 5.1.0** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose 9.0.0** - ODM for MongoDB
- **JWT 9.0.2** - Authentication tokens
- **Bcryptjs 3.0.3** - Password hashing
- **CORS 2.8.5** - Cross-origin resource sharing

## Architecture

### Frontend Architecture
- **Component-Based**: Reusable React components
- **State Management**: Zustand for global auth state
- **Routing**: React Router with protected routes
- **API Layer**: Centralized Axios configuration
- **Styling**: CSS variables for theming

### Backend Architecture
- **RESTful API**: Standard HTTP methods
- **MVC Pattern**: Routes, Models, Middleware separation
- **Authentication**: JWT-based token system
- **Database**: MongoDB with Mongoose ODM
- **Error Handling**: Consistent error responses

## Key Features Implemented

### 1. Authentication System
- User registration with role selection
- Secure login with JWT tokens
- Protected routes based on user role
- Password hashing with bcrypt

### 2. Leave Management
- Apply for leave (Employee)
- View leave statistics (Employee)
- View own requests (Employee)
- Cancel pending requests (Employee)
- Review pending requests (Manager)
- Approve/Reject requests (Manager)

### 3. User Interface
- Modern, responsive design
- Custom confirmation modals
- Toast notifications
- Loading states
- Empty states
- Error handling with user-friendly messages

### 4. Data Management
- Leave statistics calculation
- Real-time updates
- Status tracking (pending, approved, rejected)
- Date validation and calculation

## API Endpoints Summary

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| POST | `/api/leaves` | Apply for leave | Employee |
| GET | `/api/leaves/my-requests` | Get own requests | Employee |
| GET | `/api/leaves/statistics` | Get statistics | Employee |
| DELETE | `/api/leaves/:id` | Cancel request | Employee |
| GET | `/api/leaves/pending` | Get pending requests | Manager |
| PUT | `/api/leaves/:id/approve` | Approve request | Manager |
| PUT | `/api/leaves/:id/reject` | Reject request | Manager |

## Database Schema

### User Schema
- name: String
- email: String (unique)
- password: String (hashed)
- role: String (employee/manager)

### Leave Schema
- userId: ObjectId (reference to User)
- leaveType: String (sick/casual/vacation)
- startDate: Date
- endDate: Date
- totalDays: Number
- reason: String
- status: String (pending/approved/rejected)
- createdAt: Date

## Security Features

1. **Password Security**: Bcrypt hashing with salt rounds
2. **JWT Authentication**: Token-based authentication
3. **Role-Based Access**: Employee and Manager roles
4. **Input Validation**: Server-side validation
5. **Error Handling**: Secure error messages
6. **CORS Configuration**: Controlled cross-origin access

## Code Quality

- Clean, readable code structure
- Consistent naming conventions
- Proper error handling
- Input validation
- Code comments for key functions
- Modular architecture
- Separation of concerns

## UI/UX Highlights

- Modern gradient design
- Responsive grid layouts
- Smooth animations and transitions
- Color-coded status indicators
- Intuitive navigation
- User-friendly forms
- Clear visual hierarchy
- Professional typography

## Performance

- Efficient database queries
- Client-side state management
- Optimized React rendering
- Fast Vite build system
- Minimal API calls

## Testing & Validation

- Form validation (client and server)
- Date validation
- Role-based access control
- Error scenario handling
- Input sanitization

## Deployment Ready

- Environment variable configuration
- Production build scripts
- Error logging
- Health check endpoint
- CORS configuration

## Future Enhancements (Optional)

- Email notifications
- Leave calendar view
- PDF export
- Multi-level approval
- Leave carry forward
- File attachments
- Search and filters
- Dark mode toggle

---

**Project Status**: ✅ Complete and Production Ready

