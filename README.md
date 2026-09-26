# Library Management System (LMS)

A modern, full-stack Library Management System built with **Node.js, Express, PostgreSQL, and React**.

## 🌟 Features

- **Role-Based Access Control**: Two tiers of access (`Librarian` and `Student`).
- **Dynamic Dashboard**: 
  - **Librarians**: Manage books, track loans across all students, issue books, and manage other members.
  - **Students**: View all available books, check their own current active loans, and see smart alerts for upcoming due dates.
- **Automated Book Returns**: A built-in cron job automatically checks the database every hour and forcefully returns any books that have exceeded their due date, updating the available library stock automatically.
- **Smart Validation & Security**: Instantly logs out any user if their account is deleted by an admin while they are actively browsing.
- **Sleek UI**: Dark mode glassmorphism UI for a beautiful user experience.

## 🚀 Tech Stack

- **Frontend**: React (Vite), React Router, Axios
- **Backend**: Node.js, Express, JSON Web Tokens (JWT)
- **Database**: PostgreSQL (Hosted on Render)
- **Deployment**: Vercel (Frontend), Render (Backend & Database)

## 📦 Setup & Installation

### 1. Database Configuration
1. Create a PostgreSQL database (e.g., on Render).
2. Grab the connection string.

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```env
PORT=5000
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_jwt_secret_key
```

Run the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```
Open `frontend/src/api.js` and change the `baseURL` to point to your backend if you are running locally (e.g., `http://localhost:5000/api`).

Run the frontend:
```bash
npm run dev
```

---
*Built with ❤️ by Vignesh R.S.*