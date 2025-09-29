# 🚀 Railway + Vercel Deployment Guide

Deploy your Full Stack Notes Application using Railway (backend) and Vercel (frontend).

## 📋 Prerequisites

1. **MongoDB Atlas Account** (Free): [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. **GitHub Repository**: Push your code to GitHub
3. **Railway Account**: [railway.app](https://railway.app)
4. **Vercel Account**: [vercel.com](https://vercel.com)

## 🎯 Deployment Steps

### Step 1: Setup MongoDB Atlas

1. **Create Cluster**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create free cluster (M0 Sandbox)
   - Choose your preferred region

2. **Database Access**:
   - Create database user with username and password
   - Grant read/write access to any database

3. **Network Access**:
   - Add IP address: `0.0.0.0/0` (allow from anywhere)

4. **Get Connection String**:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password

### Step 2: Deploy Backend on Railway

1. **Create Railway Account**: Go to [railway.app](https://railway.app)

2. **Connect GitHub**: 
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect and select your repository

3. **Configure Deployment**:
   - Railway will auto-detect the `railway.toml` file
   - Root directory will be set automatically

4. **Set Environment Variables**:
   Go to your project → Variables tab and add:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/notesapp
   JWT_SECRET=your-32-character-secret-key-here
   JWT_REFRESH_SECRET=your-32-character-refresh-secret-here
   JWT_EXPIRE=15m
   JWT_REFRESH_EXPIRE=7d
   NODE_ENV=production
   FRONTEND_URL=https://your-app-name.vercel.app
   ```

5. **Generate JWT Secrets**:
   ```bash
   # Run this command twice to get two different secrets
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

6. **Deploy**: Railway will automatically deploy your backend

### Step 3: Deploy Frontend on Vercel

1. **Create Vercel Account**: Go to [vercel.com](https://vercel.com)

2. **Import Project**:
   - Click "New Project"
   - Import your GitHub repository
   - Select the repository

3. **Configure Build Settings**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)

4. **Set Environment Variables**:
   In project settings → Environment Variables, add:
   ```
   VITE_API_URL=https://your-railway-app.railway.app/api
   ```
   (Replace with your actual Railway backend URL)

5. **Deploy**: Click "Deploy" - Vercel will build and deploy your frontend

## ✅ Verify Deployment

### Test Your Backend
1. **Health Check**: Visit `https://your-railway-app.railway.app/api/health`
2. **Should return**: `{"status":"OK","timestamp":"..."}`

### Test Your Frontend
1. **Visit**: `https://your-app-name.vercel.app`
2. **Register**: Create a new account
3. **Login**: Test authentication
4. **Create Notes**: Test full functionality

## 🔧 Environment Variables Reference

### Railway (Backend)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/notesapp
JWT_SECRET=32-character-random-string
JWT_REFRESH_SECRET=32-character-random-string
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
NODE_ENV=production
FRONTEND_URL=https://your-app-name.vercel.app
```

### Vercel (Frontend)
```env
VITE_API_URL=https://your-railway-app.railway.app/api
```

## � Trcoubleshooting

### Common Issues

1. **CORS Errors**:
   - Ensure `FRONTEND_URL` in Railway matches your Vercel domain exactly
   - Check that both HTTP and HTTPS are handled

2. **Database Connection Failed**:
   - Verify MongoDB URI format in Railway
   - Check MongoDB Atlas network access (0.0.0.0/0)
   - Ensure database user has correct permissions

3. **API Not Found (404)**:
   - Verify `VITE_API_URL` in Vercel points to Railway backend
   - Ensure Railway backend is deployed and running
   - Check Railway logs for errors

4. **Build Failures**:
   - Verify Node.js version compatibility (18+)
   - Check Railway and Vercel build logs
   - Ensure all dependencies are in package.json

### Quick Fixes

- **Railway Backend URL**: Should end with `.railway.app`
- **Vercel Frontend URL**: Should end with `.vercel.app`
- **API URL Format**: `https://your-app.railway.app/api` (note the `/api`)
- **MongoDB URI**: Must include database name and proper encoding

## 🔒 Security Checklist

- [x] Strong JWT secrets (32+ characters)
- [x] MongoDB connection secured with username/password
- [x] CORS configured for production domain
- [x] Rate limiting enabled
- [x] HTTPS enabled on both platforms
- [x] Environment variables secured (not in Git)

## 🎉 Success!

Once deployed, your application will be live at:
- **Frontend**: `https://your-app-name.vercel.app`
- **Backend API**: `https://your-app-name.railway.app/api`
- **Health Check**: `https://your-app-name.railway.app/api/health`

**Total Deployment Time**: ~10-15 minutes  
**Monthly Cost**: $0 (Free tiers)  
**Global CDN**: ✅ Included  
**SSL Certificate**: ✅ Automatic  

Share your live application and enjoy your deployed Full Stack Notes App! 🚀