# 📚 Library Management System (LMS)

A modern, full-stack Library Management System built with the PERN stack (PostgreSQL, Express.js, React, Node.js). 

This application allows librarians to securely manage books, members, and library loans, while allowing students and members to view the catalog.

---

### 🌟 Live Cloud Deployment
- **Frontend (Vercel):** [https://lms-woad-iota.vercel.app](https://lms-woad-iota.vercel.app)
- **Backend (Render):** [https://lms-aifv.onrender.com](https://lms-aifv.onrender.com)

---

## 🎯 What it Does
This software automates the daily operations of a library. It is split into two distinct roles:
1. **Student / Member**: Can log in to browse the library's catalog, search for books by title or author, see how many copies are available in real-time, and view the history of books that have been checked out.
2. **Librarian (Admin)**: Has full control over the database. The Librarian can add new books to the inventory, register new members, issue books to members (which automatically decreases available stock), and return books (which restores stock). It also tracks overdue books.

---

## 🛠️ Languages & Technologies Used

### **Frontend**
- **Language:** JavaScript (React.js)
- **Build Tool:** Vite
- **Routing:** React-Router-Dom
- **API Client:** Axios
- **Styling:** Vanilla CSS (Dark Mode & Glassmorphism Design)

### **Backend**
- **Language:** JavaScript (Node.js)
- **Framework:** Express.js
- **Security:** JSON Web Tokens (JWT) for authentication, `bcryptjs` for password hashing.
- **CORS:** Cross-Origin Resource Sharing enabled for frontend communication.

### **Database**
- **Database Engine:** PostgreSQL (Relational Database)
- **Driver:** `pg` (Node Postgres)
- **GUI Manager:** pgAdmin 4

---

## 📂 What it Contains (Project Structure)
The project is a monorepo containing both the frontend and backend in a single folder:

```text
LMS/
├── frontend/                # React Vite Application
│   ├── src/                 
│   │   ├── api.js           # Axios configuration for backend communication
│   │   ├── App.jsx          # Main React Routing
│   │   ├── context/         # AuthContext for global user state
│   │   └── pages/           # UI Components (Login, Register, Dashboard, Books, Members, Loans)
│   └── package.json         # Frontend dependencies
│
├── backend/                 # Node.js Express API
│   ├── src/
│   │   ├── config/          # PostgreSQL database connection (database.js)
│   │   ├── controllers/     # API logic (authController, bookController, etc)
│   │   ├── middleware/      # JWT Authentication protection (authMiddleware)
│   │   ├── routes/          # API URL definitions
│   │   └── server.js        # Main Express server setup
│   └── package.json         # Backend dependencies
```

---

## 💻 Required Software to Run Locally
To run this project on your own computer, you must have the following installed:
1. **Node.js** (v18+) - To run the frontend and backend.
2. **PostgreSQL** - The database engine.
3. **pgAdmin 4** - To view your database tables visually.
4. **Git** - To clone the repository.
5. **VS Code** (Optional but recommended) - Code editor.

---

## 🚀 Installation & Setup Instructions

### 1. Clone the Code
Open your terminal (PowerShell or Command Prompt) and run:
```bash
git clone https://github.com/Vignesh-R30/LMS.git
cd LMS
```

### 2. Setup the Database (PostgreSQL)
1. Open **pgAdmin 4**.
2. Create a brand new database named `lms_db`.
3. You do not need to manually create the tables! The backend has an automatic setup script.

### 3. Setup the Backend
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install all required Node.js packages:
   ```bash
   npm.cmd install
   ```
3. Create a file named `.env` inside the `backend` folder and add your database credentials:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=lms_db
   DB_USER=postgres
   DB_PASSWORD=your_local_pg_password
   JWT_SECRET=your_jwt_secret
   LIBRARIAN_SECRET=admin123
   ```
4. Start the backend server:
   ```bash
   npm.cmd run dev
   ```
5. **Generate the Database Tables**: Open your web browser and go to `http://localhost:5000/api/setup-database`. This will automatically create all SQL tables for you!

### 4. Setup the Frontend
1. Open a **second** terminal window and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install all React dependencies:
   ```bash
   npm.cmd install
   ```
3. Start the React development server:
   ```bash
   npm.cmd run dev
   ```
4. Open your browser and go to the link provided (usually `http://localhost:5173`).

---

## 🔒 Security Features
- **Passwords are encrypted** in the database using `bcryptjs` (salt & hash).
- **Protected Routes**: Users cannot access the Dashboard, Books, or Loans pages without a valid JWT token.
- **Role-Based Access Control**: Standard users cannot add books or issue loans.
- **Admin Key**: Registering a Librarian account requires a master secret key (`admin123`).