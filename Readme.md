# Candidate Management System

A modern full-stack Candidate Management System built with **React**, **Node.js**, **Express**, **MongoDB Atlas**, and **JWT Authentication**. The application enables recruiters to manage candidates throughout the hiring pipeline using an intuitive dashboard, Kanban workflow, candidate management, and recruiter notes.

---

# Features

## Authentication

* User Registration
* User Login
* JWT Authentication
* Protected Routes
* Logout

## Dashboard

* Total Candidates
* Applied Candidates
* Screening Candidates
* Interview Candidates
* Selected Candidates
* Rejected Candidates

## Candidate Management

* Create Candidate
* Update Candidate
* Delete Candidate
* View Candidate Details
* Resume URL Support
* Skills Management
* Experience Tracking

## Candidate Listing

* Search
* Pagination
* Sorting
* Status Filtering
* Experience Filtering

## Recruiter Notes

* Create Notes
* Edit Notes
* Delete Notes
* Timestamp Display

## Kanban Board

* Drag & Drop Candidate Cards
* Status Updates
* Applied
* Screening
* Interview
* Selected
* Rejected

## Activity

* Candidate Activities
* Status Tracking
* Recruiter Actions

---

# Tech Stack

## Frontend

* React 19
* TypeScript
* Vite
* React Router
* React Hook Form
* Tailwind CSS
* Radix UI

## Backend

* Node.js
* Express.js
* TypeScript
* JWT
* bcryptjs
* Mongoose

## Database

* MongoDB Atlas

## Package Manager

* pnpm Workspace

---

# Project Structure

```
copy-candid
│
├── artifacts
│   ├── ats                 # React Frontend
│   └── api-server          # Express Backend
│
├── lib                     # Shared Libraries
├── scripts
├── package.json
├── pnpm-workspace.yaml
└── .env.example
```

---

# Installation

## Clone Repository

```bash
git clone <repository-url>
cd copy-candid
```

## Install Dependencies

```bash
pnpm install
```

---

# Environment Variables

Create a `.env` file in the project root.

Example:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/candidate-manager

JWT_SECRET=your_jwt_secret

PORT=3000

NODE_ENV=development

CLIENT_URL=http://localhost:5173
```

---

# Running the Backend

```bash
cd artifacts/api-server

pnpm run build

pnpm run start
```

For development:

```bash
pnpm run dev
```

---

# Running the Frontend

```bash
cd artifacts/ats

pnpm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

# Build Project

Frontend

```bash
pnpm run build
```

Backend

```bash
pnpm run build
```

---

# API Overview

## Authentication

POST

```
/api/auth/register
```

POST

```
/api/auth/login
```

---

## Candidates

GET

```
/api/candidates
```

GET

```
/api/candidates/:id
```

POST

```
/api/candidates
```

PUT

```
/api/candidates/:id
```

DELETE

```
/api/candidates/:id
```

---

## Notes

POST

```
/api/candidates/:id/notes
```

GET

```
/api/candidates/:id/notes
```

PUT

```
/api/notes/:id
```

DELETE

```
/api/notes/:id
```

---

# Database Collections

## Users

* Name
* Email
* Password
* Role

## Candidates

* Name
* Email
* Phone
* Skills
* Experience
* Company
* Resume URL
* Status

## Notes

* Candidate ID
* Note
* Created By
* Created At

---

# Assignment Features Implemented

* JWT Authentication
* Candidate CRUD
* Dashboard Analytics
* Candidate Search
* Candidate Filtering
* Candidate Pagination
* Recruiter Notes
* Kanban Workflow
* MongoDB Atlas
* Responsive UI

---

# Future Improvements

* Resume Upload
* Resume Parsing
* Email Notifications
* Dark Mode
* Activity Timeline
* Role-Based Access Control
* Unit Testing
* Integration Testing

---

# Author

Shravan Kumar

Full Stack Developer

React • Node.js • MongoDB • TypeScript
