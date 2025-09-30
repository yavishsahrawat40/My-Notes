# Scalable Web App with Authentication & Dashboard

A full-stack web application built with React.js frontend and Node.js/Express backend, featuring JWT authentication and complete CRUD operations on a Notes entity.

## 🏗️ Architecture

```
├── frontend/          # React.js + TailwindCSS + Vite
├── backend/           # Node.js + Express + MongoDB
├── DEPLOYMENT.md      # Deployment instructions
└── README.md          # This file
```

## 🚀 Quick Start

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Add your MongoDB URI and JWT secrets to .env
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## ✨ Core Features

### Frontend (React.js)
- **Responsive Design**: TailwindCSS with mobile-first approach
- **Authentication Flow**: Login/Register with JWT tokens
- **Protected Routes**: Dashboard access requires authentication
- **Form Validation**: Client-side validation with react-hook-form + yup
- **CRUD Interface**: Complete Notes management system
- **Search & Filter**: Advanced filtering by category, priority, tags
- **Modern UI/UX**: Glass morphism, animations, password visibility toggles

### Backend (Node.js/Express)
- **JWT Authentication**: Access + refresh token system
- **Password Security**: bcrypt hashing with salt rounds
- **API Validation**: Server-side validation with express-validator
- **Database**: MongoDB with Mongoose ODM
- **Security**: Helmet, CORS, rate limiting
- **Error Handling**: Comprehensive error middleware

## 🔐 Security Implementation

- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT Tokens**: Secure access + refresh token system
- **Protected Routes**: Middleware-based route protection
- **Input Validation**: Both client and server-side validation
- **CORS Configuration**: Proper cross-origin setup
- **Rate Limiting**: API protection against abuse

## 📡 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Token refresh
- `POST /api/auth/logout` - User logout

### User Management
- `GET /api/users/me` - Get user profile (protected)
- `PUT /api/users/me` - Update profile (protected)

### Notes CRUD (Protected Routes)
- `GET /api/notes` - Get user's notes with pagination/filtering
- `POST /api/notes` - Create new note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `GET /api/health` - Health check endpoint

## 🎯 Assignment Requirements Fulfilled

### ✅ Frontend (Primary Focus)
- **Framework**: React.js with Vite build tool
- **Styling**: TailwindCSS for responsive design
- **Validation**: Client + server-side form validation
- **Authentication**: Protected routes requiring login
- **UI/UX**: Modern, responsive interface with excellent user experience

### ✅ Backend (Supportive)
- **Framework**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based signup/login system
- **CRUD Entity**: Complete Notes management (create, read, update, delete)
- **API Design**: RESTful endpoints with proper HTTP methods

### ✅ Dashboard Features
- **User Profile**: Display and edit user information
- **Notes Management**: Full CRUD operations on Notes entity
- **Search & Filter**: Advanced filtering and search functionality
- **Logout Flow**: Secure token invalidation

### ✅ Security & Scalability
- **Password Security**: bcrypt hashing implementation
- **JWT Middleware**: Token validation for protected routes
- **Error Handling**: Comprehensive validation and error management
- **Code Structure**: Modular architecture for easy scaling

## 🏗️ Scalability Notes

The application is structured for production scaling:

- **Modular Architecture**: Separate frontend/backend with clear API boundaries
- **Environment Configuration**: Proper environment variable management
- **Database Indexing**: Optimized MongoDB queries with proper indexing
- **Stateless Design**: JWT tokens enable horizontal scaling
- **Error Handling**: Robust error management and logging
- **Security Best Practices**: Rate limiting, CORS, input validation

## 🚀 Deployment

**Live Application**: Deployed on Railway (backend) + Vercel (frontend)

- **Frontend**: https://my-notes-six-sooty.vercel.app/
- **Backend API**: https://my-notes-production-50b5.up.railway.app/api
- **Health Check**: https://my-notes-production-50b5.up.railway.app/api/health

### Quick Deploy
1. **MongoDB Atlas**: Create free cluster
2. **Railway**: Deploy backend with environment variables
3. **Vercel**: Deploy frontend with API URL configuration

**Deployment Guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step instructions

## 📋 Technical Stack

**Frontend**: React.js, TailwindCSS, Vite, React Router, React Hook Form  
**Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt  
**Deployment**: Railway (backend), Vercel (frontend), MongoDB Atlas  
**Security**: JWT authentication, password hashing, input validation, CORS