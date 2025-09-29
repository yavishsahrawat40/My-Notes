# ⚡ Quick Deploy Guide - Railway + Vercel

Deploy your Full Stack Notes App in 10 minutes!

## 🚀 Step-by-Step

### 1. MongoDB Atlas (2 minutes)
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) → Sign up
2. Create free cluster (M0 Sandbox)
3. Create database user: `Database Access` → `Add New User`
4. Allow all IPs: `Network Access` → `Add IP Address` → `0.0.0.0/0`
5. Get connection string: `Connect` → `Connect your application` → Copy URI

### 2. Railway Backend (3 minutes)
1. Go to [railway.app](https://railway.app) → Sign up with GitHub
2. `New Project` → `Deploy from GitHub repo` → Select your repo
3. Go to `Variables` tab and add:
   ```
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=run-this-command-below-to-generate
   JWT_REFRESH_SECRET=run-this-command-again-for-different-secret
   NODE_ENV=production
   FRONTEND_URL=https://your-app-name.vercel.app
   ```
4. Generate secrets: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
5. Railway auto-deploys → Copy your Railway URL

### 3. Vercel Frontend (3 minutes)
1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. `New Project` → Import your GitHub repo
3. **Root Directory**: `frontend`
4. Add environment variable:
   ```
   VITE_API_URL=https://your-railway-url.railway.app/api
   ```
5. Click `Deploy`

### 4. Update Railway (1 minute)
1. Go back to Railway → Variables
2. Update `FRONTEND_URL` with your actual Vercel URL
3. Railway will redeploy automatically

### 5. Test (1 minute)
1. Visit your Vercel URL
2. Register a new account
3. Create a note
4. ✅ Done!

## 🎯 URLs You'll Get
- **Your App**: `https://your-app-name.vercel.app`
- **API**: `https://your-app-name.railway.app/api`
- **Health Check**: `https://your-app-name.railway.app/api/health`

## 🔧 Need Help?
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions
- Verify environment variables are correct
- Check Railway and Vercel logs for errors

**That's it! Your app is now live! 🎉**