# 📚 Modern Full-Stack Library Management System (LMS)

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.x-4169E1?logo=postgresql&logoColor=white)

A robust, fully responsive, and highly secure **Library Management System** built using the **PERN stack** (PostgreSQL, Express.js, React.js, Node.js). 

This project goes beyond simple CRUD operations by implementing **Role-Based Access Control (RBAC)**, an **automated background chron-job** for returning overdue books, secure forced logouts, and a **Digital E-Library** feature where students can instantly read issued books via digital links.

---

## ✨ Key Features

### 🔐 Advanced Security & Authentication
- **JWT Authentication:** Secure stateless authentication using JSON Web Tokens.
- **Role-Based Access Control:** Distinct `Librarian` (Admin) and `Student` (Member) privilege tiers.
- **Dynamic Session Invalidation:** If an admin deletes a student's account, a custom middleware instantly intercepts active sessions and forces a logout.

### 👥 Comprehensive Role Capabilities

**👨‍🎓 Student (Member) Features:**
- **Personalized Dashboard:** Instantly view all currently issued books upon login.
- **Smart Due Date Alerts:** Books highlight in Orange when due within 3 days, and Red when overdue.
- **Digital Reading:** One-click access to read digital copies (PDFs/Websites) of issued books directly from the dashboard.
- **Library Catalog Access:** Search, filter, and browse the entire library's available book inventory.
- **Real-Time Stock Checking:** See exactly how many physical/digital copies of a book are currently available.

**👩‍🏫 Librarian (Admin) Features:**
- **Master Dashboard:** Full oversight over the entire system.
- **Inventory Management:** Add new books (with digital `read_links`), update existing book details, and safely delete books from the system.
- **Loan Management:** Manually issue books to specific students, set custom due dates, and process book returns to instantly restock inventory.
- **User Management (Students & Librarians):** View all registered students and librarians.
- **Secure Moderation:** One-click deletion of any student or librarian account. If an active user is deleted, the system's security middleware instantly force-logs them out globally.
- **Overdue Tracking:** Access specialized views to track all currently overdue loans across the entire system.

### 📖 Digital E-Library Integration
- Books aren't limited to physical tracking. Librarians can attach a `read_link` to any book. When a book is issued, the student receives a secure **"📖 Read Book"** button on their dashboard to access the digital PDF/Website instantly.

### ⚙️ Automated Inventory Management
- **Smart Cron Job:** The backend runs a background process every hour that actively scans the PostgreSQL database. Any books that have exceeded their due date are forcefully marked as returned, and the global library inventory is automatically incremented.
- **Transactional Integrity:** SQL Transactions (`BEGIN` and `COMMIT`) are used during check-outs to prevent race conditions when multiple users try to borrow the last available copy of a book.

### 📱 Fully Mobile Responsive & UI/UX
- **Glassmorphism Design:** A beautiful, dark-themed frosted-glass aesthetic.
- **100% Mobile Ready:** Extensive CSS media queries ensure the sidebar collapses intuitively, grids stack correctly, and data tables become horizontally scrollable on mobile devices.

---

## 🛠️ Technology Stack

| Category | Technology |
| :--- | :--- |
| **Frontend** | React (Vite), React Router DOM, Axios, Vanilla CSS |
| **Backend** | Node.js, Express.js, node-postgres (`pg`) |
| **Database** | PostgreSQL |
| **Security** | `bcryptjs` (Password Hashing), `jsonwebtoken` (Auth) |
| **Hosting** | Vercel (Frontend), Render (Backend API & PostgreSQL Database) |

---

## 📂 Project Structure

```text
Library-Management-System/
├── backend/
│   ├── src/
│   │   ├── config/          # Database connection setup
│   │   ├── controllers/     # API logic (auth, books, loans)
│   │   ├── middleware/      # JWT verification & role checking
│   │   ├── routes/          # Express route definitions
│   │   └── server.js        # Entry point, database sync, & cron jobs
│   ├── .env                 # Backend environment variables
│   └── package.json
└── frontend/
    ├── src/
    │   ├── assets/          # Images and static files
    │   ├── components/      # Reusable UI components
    │   ├── context/         # React Context API (Auth state)
    │   ├── pages/           # Main views (Home, Books, Students, etc.)
    │   ├── api.js           # Global Axios instance & interceptors
    │   ├── App.jsx          # Route declarations
    │   └── main.jsx         # React root
    ├── .env                 # Frontend environment variables
    └── package.json
```

---

## 🚀 Local Installation & Setup Guide

To run this project locally, follow these steps sequentially:

### 1. Prerequisites
- Node.js (v18 or higher)
- PostgreSQL installed locally (or a cloud instance like Render/Supabase)
- Git

### 2. Clone the Repository
```bash
git clone https://github.com/Vignesh-R30/LMS.git
cd LMS
```

### 3. Database Configuration
1. Open your PostgreSQL terminal (or pgAdmin) and create a new database:
   ```sql
   CREATE DATABASE library_management_system;
   ```
2. *Note: You do not need to manually create tables. The backend `server.js` includes an auto-setup script that will create the necessary tables on the first run.*

### 4. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   npm install
   ```
2. Create a `.env` file in the `backend` directory and configure the following variables:
   ```env
   PORT=5000
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/library_management_system
   JWT_SECRET=your_super_secret_jwt_key_here
   ```
3. Start the backend server:
   ```bash
   npm run dev
   ```
   *The server will run on `http://localhost:5000` and automatically provision the database tables.*

### 5. Frontend Setup
1. Open a new terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   npm install
   ```
2. Configure the API Base URL. Open `frontend/src/api.js` and ensure the `baseURL` points to your local backend:
   ```javascript
   const api = axios.create({
       baseURL: 'http://localhost:5000/api', // Local development URL
   });
   ```
3. Start the React frontend:
   ```bash
   npm run dev
   ```
   *The application will launch on `http://localhost:5173`.*

---

## 🔑 Usage & Default Roles

When you first launch the application, you can create a new account.

**To become a Librarian (Admin):**
1. Log in.
2. Click the **"Switch Role"** button at the bottom of the sidebar.
3. When prompted for the Admin Secret Key, enter: `lmsadmin`.
4. You will instantly be upgraded to Librarian privileges.

---

## 🔗 Core API Endpoints

**Auth Routes (`/api/auth`)**
- `POST /register` - Register a new user
- `POST /login` - Authenticate user & get JWT
- `GET /users/:role` - Fetch all users by specific role
- `DELETE /:id` - Admin deletion of a user

**Book Routes (`/api/books`)**
- `GET /` - Fetch all books (supports `?search=` queries)
- `POST /` - Add a new book (Librarian only)
- `PUT /:id` - Update book details
- `DELETE /:id` - Remove a book

**Loan Routes (`/api/loans`)**
- `GET /` - View all active and past loans (Librarian only)
- `POST /issue` - Issue a book and deduct stock
- `POST /return/:id` - Return a book and restore stock
- `GET /my-loans` - Fetch loans specifically for the logged-in student

---
*Developed with ❤️ by **Vignesh R.S.***