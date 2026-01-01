# Task Manager - Render Deployment Guide

This guide details how to deploy both the **backend** and **frontend** of the Task Manager application to [Render](https://render.com).

---

## Prerequisites

1.  **GitHub Repository**: Ensure your project is pushed to a GitHub repository.
2.  **Render Account**: Create an account at [render.com](https://render.com).
3.  **Database**: You should have a MongoDB connection string (e.g., from MongoDB Atlas).

---

## Part 1: Deploy Backend (Web Service)

1.  **Create Service**:
    *   Go to your Render Dashboard.
    *   Click **New +** and select **Web Service**.
    *   Connect your GitHub repository.

2.  **Configure Service**:
    *   **Name**: `task-manager-backend` (or similar)
    *   **Region**: Select a region close to you.
    *   **Root Directory**: `backend`
    *   **Runtime**: `Node`
    *   **Build Command**: `npm install`
    *   **Start Command**: `npm start`

3.  **Environment Variables**:
    *   Scroll down to **Environment Variables** and click **Add Environment Variable**. Add the following from your local `backend/.env` file:
        *   `MONGO_URI`: Your MongoDB connection string.
        *   `JWT_SECRET`: A secure random string for authentication.
        *   `PORT`: `10000` (Render sets this automatically, but good to be aware).
        *   `CLIENT_URL`: *Leave this blank for now, or set a placeholder. We will update it after deploying the frontend.*
        *   `ACCESS_TOKEN_EXPIRY`: `15m` (example)
        *   `REFRESH_TOKEN_EXPIRY`: `7d` (example)

4.  **Deploy**:
    *   Click **Create Web Service**.
    *   Wait for the build to finish. Once successful, copy the **onrender.com URL** (e.g., `https://task-manager-backend.onrender.com`).

---

## Part 2: Deploy Frontend (Static Site)

1.  **Create Service**:
    *   Go to your Render Dashboard.
    *   Click **New +** and select **Static Site**.
    *   Connect the **same** GitHub repository.

2.  **Configure Service**:
    *   **Name**: `task-manager-frontend`
    *   **Root Directory**: `frontend`
    *   **Build Command**: `npm install && npm run build`
    *   **Publish Directory**: `dist`

3.  **Environment Variables**:
    *   Add the following environment variable:
        *   `VITE_API_URL`: The Backend URL you utilized in Part 1 (e.g., `https://task-manager-backend.onrender.com`).
    *   *Note: usage of `.env` variables in Vite requires them to be prefixed with `VITE_`.*

4.  **SPA Configuration (Important)**:
    *   Since this is a Single Page Application (React Router), you need to handle routing.
    *   Go to the **Redirects/Rewrites** tab (or check inside "Advanced" during creation).
    *   Add a **Rewrite** rule:
        *   **Source**: `/*`
        *   **Destination**: `/index.html`
        *   **Action**: `Rewrite`
    *   *This ensures that refreshing a page like `/dashboard` does not return a 404.*

5.  **Deploy**:
    *   Click **Create Static Site**.
    *   Wait for the deployment to finish. Copy the **onrender.com URL** (e.g., `https://task-manager-frontend.onrender.com`).

---

## Part 3: Final Connection

1.  **Update Backend**:
    *   Go back to your **Backend Web Service** on Render.
    *   Go to the **Environment** tab.
    *   Update (or add) the `CLIENT_URL` variable.
    *   Set it to your **Frontend URL** (e.g., `https://task-manager-frontend.onrender.com`).
    *   Save changes. Render will automatically redeploy the backend.

---

## Troubleshooting

*   **CORS Errors**: If you see CORS errors in the browser console, ensure the `CLIENT_URL` in the backend environment variables exactly matches your frontend URL (no trailing slash is usually best, e.g., `https://site.onrender.com`).
*   **404 on Refresh**: If refreshing the page gives a "Not Found", verify you added the Rewrite rule (`/*` -> `/index.html`) in the Frontend Static Site settings.
*   **Build Fails**: Check the logs. Ensure `npm install` runs correctly. If you have a lockfile, ensure it's committed.
*   **"npm error enoent Could not read package.json"**: This means Render is looking for `package.json` in the wrong folder.
    *   **Solution**: Go to **Settings** in your Render service. Scroll down to **Build & Deploy**. Ensure **Root Directory** is set to `backend` (for backend service) or `frontend` (for frontend service). If it's empty, Render looks in the repository root, where no `package.json` exists.
