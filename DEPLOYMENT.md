# Task Manager - Deployment Guide

This guide walks you through deploying the Task Manager application to Vercel (frontend) and Render (backend).

---

## Prerequisites

- [ ] GitHub account
- [ ] Vercel account (sign up at [vercel.com](https://vercel.com))
- [ ] Render account (sign up at [render.com](https://render.com))
- [ ] MongoDB Atlas account (or other MongoDB hosting)

---

## Step 1: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier is fine)
3. Create a database user with username and password
4. Whitelist all IP addresses (0.0.0.0/0) for Render access
5. Get your connection string - it will look like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/task-manager?retryWrites=true&w=majority
   ```

---

## Step 2: Deploy Backend to Render

### Create Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select the repository containing your Task Manager

### Configure Service

- **Name**: `task-manager-backend` (or your preferred name)
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Instance Type**: Free (or paid for better performance)

### Set Environment Variables

Click **"Advanced"** and add these environment variables:

| Key | Value |
|-----|-------|
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `CLIENT_URL` | `https://your-app.vercel.app` (update after deploying frontend) |
| `JWT_SECRET` | Generate using: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `ACCESS_TOKEN_EXPIRY` | `15m` |
| `REFRESH_TOKEN_EXPIRY` | `7d` |

> **Note**: You'll update `CLIENT_URL` after deploying the frontend in Step 3.

### Deploy

1. Click **"Create Web Service"**
2. Wait for deployment to complete (5-10 minutes)
3. Copy your backend URL (e.g., `https://task-manager-backend.onrender.com`)

---

## Step 3: Deploy Frontend to Vercel

### Create Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Select the repository containing your Task Manager

### Configure Project

- **Framework Preset**: Vite
- **Root Directory**: `frontend`
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `dist` (auto-detected)

### Set Environment Variables

Click **"Environment Variables"** and add:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | Your Render backend URL from Step 2 |

Example: `https://task-manager-backend.onrender.com`

### Deploy

1. Click **"Deploy"**
2. Wait for deployment to complete (2-5 minutes)
3. Copy your frontend URL (e.g., `https://task-manager.vercel.app`)

---

## Step 4: Update Backend CORS

Now that you have your frontend URL, update the backend:

1. Go back to Render Dashboard
2. Select your backend service
3. Go to **"Environment"** tab
4. Update `CLIENT_URL` to your Vercel URL (e.g., `https://task-manager.vercel.app`)
5. Click **"Save Changes"**
6. Render will automatically redeploy

---

## Step 5: Test Your Deployment

### Test Authentication

1. Visit your Vercel URL
2. Try to register a new account
3. Log in with your credentials
4. Verify you can access the dashboard

### Test CORS

- Open browser DevTools (F12)
- Check Network tab for any CORS errors
- All API requests should succeed

### Test Features

- [ ] Create a new task
- [ ] Update task status
- [ ] Delete a task
- [ ] Create a new user (if admin)
- [ ] Upload profile image
- [ ] Generate reports

---

## Troubleshooting

### Frontend can't connect to backend

**Problem**: API requests fail with network errors

**Solutions**:
- Verify `VITE_API_URL` is set correctly in Vercel
- Check that backend is running on Render
- Verify CORS `CLIENT_URL` matches your Vercel URL exactly

### CORS errors

**Problem**: Browser shows CORS policy errors

**Solutions**:
- Ensure `CLIENT_URL` in Render matches your Vercel URL
- Don't include trailing slash in URLs
- Redeploy backend after updating `CLIENT_URL`

### Authentication not working

**Problem**: Login fails or tokens don't persist

**Solutions**:
- Verify `JWT_SECRET` is set in Render
- Check that both URLs use HTTPS (not HTTP)
- Ensure cookies are enabled in browser

### Database connection fails

**Problem**: Backend logs show MongoDB connection errors

**Solutions**:
- Verify `MONGO_URI` is correct
- Check MongoDB Atlas IP whitelist includes 0.0.0.0/0
- Ensure database user has correct permissions

### File uploads not persisting

**Problem**: Uploaded images disappear after backend restart

**Solutions**:
- This is expected on Render's free tier (ephemeral filesystem)
- Consider using cloud storage (AWS S3, Cloudinary) for production
- Uploads work but won't persist across deployments

---

## Environment Variables Reference

### Frontend (.env)

```bash
VITE_API_URL=https://your-backend.onrender.com
```

### Backend (.env)

```bash
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/task-manager
CLIENT_URL=https://your-app.vercel.app
PORT=5555
JWT_SECRET=your-generated-secret-key
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
```

---

## Post-Deployment Checklist

- [ ] Frontend deployed successfully to Vercel
- [ ] Backend deployed successfully to Render
- [ ] MongoDB Atlas configured and connected
- [ ] All environment variables set correctly
- [ ] CORS configured with correct frontend URL
- [ ] Authentication flow tested (register, login, logout)
- [ ] Task CRUD operations tested
- [ ] User management tested (if admin)
- [ ] File uploads tested
- [ ] No console errors in browser DevTools

---

## Updating Your Deployment

### Frontend Updates

1. Push changes to GitHub
2. Vercel automatically redeploys
3. Check deployment status in Vercel dashboard

### Backend Updates

1. Push changes to GitHub
2. Render automatically redeploys
3. Check deployment logs in Render dashboard

### Environment Variable Updates

- **Vercel**: Dashboard → Project → Settings → Environment Variables
- **Render**: Dashboard → Service → Environment → Edit

---

## Production Considerations

### Security

- [ ] Use strong, unique `JWT_SECRET` (64+ characters)
- [ ] Enable MongoDB Atlas IP whitelisting for specific IPs (not 0.0.0.0/0)
- [ ] Use environment-specific secrets
- [ ] Enable HTTPS only (both platforms do this by default)

### Performance

- [ ] Consider upgrading Render to paid tier for better performance
- [ ] Enable Vercel Analytics for monitoring
- [ ] Set up MongoDB indexes for frequently queried fields
- [ ] Consider Redis for session management (optional)

### Monitoring

- [ ] Set up error tracking (Sentry, LogRocket, etc.)
- [ ] Monitor Render logs for backend errors
- [ ] Monitor Vercel logs for frontend errors
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom, etc.)

### Backups

- [ ] Enable MongoDB Atlas automated backups
- [ ] Keep local copies of environment variables
- [ ] Document your deployment configuration

---

## Support

If you encounter issues:

1. Check Render logs: Dashboard → Service → Logs
2. Check Vercel logs: Dashboard → Project → Deployments → View Logs
3. Check browser console for frontend errors
4. Verify all environment variables are set correctly

---

## Success! 🎉

Your Task Manager is now live and accessible to users worldwide!

- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-backend.onrender.com
