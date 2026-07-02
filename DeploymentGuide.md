# Deployment Guide

## Prerequisites

* GitHub Repository
* MongoDB Atlas Cluster
* Vercel Account
* Render Account
* pnpm

---

# Step 1 – MongoDB Atlas

1. Create a MongoDB Atlas cluster.
2. Create a database user.
3. Add your IP address (or use `0.0.0.0/0` during testing).
4. Copy the connection string.
5. Replace `<password>` with your database password.

Example:

```text
mongodb+srv://username:password@cluster.mongodb.net/candidate-manager
```

---

# Step 2 – Backend Deployment (Render)

Create a new **Web Service**.

## Root Directory

```
artifacts/api-server
```

## Build Command

```bash
pnpm install
pnpm run build
```

## Start Command

```bash
pnpm run start
```

## Environment Variables

```env
NODE_ENV=production

PORT=10000

JWT_SECRET=<your-secret>

MONGO_URI=<mongodb-atlas-uri>

CLIENT_URL=<frontend-url>
```

Deploy the service and copy the generated backend URL.

Example:

```
https://candidate-api.onrender.com
```

---

# Step 3 – Frontend Deployment (Vercel)

Import the GitHub repository.

## Root Directory

```
artifacts/ats
```

## Build Command

```bash
pnpm run build
```

## Output Directory

```
dist
```

## Environment Variables

```env
VITE_API_URL=https://candidate-api.onrender.com
```

Deploy the project.

Example:

```
https://candidate-manager.vercel.app
```

---

# Step 4 – Update CORS

Allow the frontend domain in the backend CORS configuration.

Example:

```
https://candidate-manager.vercel.app
```

---

# Step 5 – Verify

* User Registration
* Login
* JWT Authentication
* Dashboard
* Candidate CRUD
* Search
* Pagination
* Kanban Drag & Drop
* Recruiter Notes
* MongoDB Persistence

---

# Production Checklist

* MongoDB Atlas Connected
* JWT Secret Configured
* Environment Variables Added
* HTTPS Enabled
* CORS Configured
* Build Successful
* API Reachable
* Frontend Connected to Backend
* Database Writes Verified

---

# Troubleshooting

## MongoDB Connection Error

* Verify `MONGO_URI`
* Ensure the database user has access.
* Confirm IP allow-list configuration.

## Invalid JWT

* Verify `JWT_SECRET`.
* Clear browser cookies/local storage if using stale tokens.

## Frontend Cannot Reach Backend

* Confirm `VITE_API_URL` points to the deployed backend.
* Check CORS settings on the backend.

## Build Failure

* Run:

```bash
pnpm install
pnpm run build
```

locally and resolve any TypeScript or dependency errors before redeploying.

---

# Suggested Production Architecture

```
Browser
    │
    ▼
Vercel (React)
    │
    ▼
Render (Express API)
    │
    ▼
MongoDB Atlas
```
