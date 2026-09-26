# 📚 Library Management System (LMS)

A modern, full-stack Library Management System built with the PERN stack (PostgreSQL, Express.js, React, Node.js). 

This application allows librarians to securely manage books, members, and library loans, while allowing students and members to view the catalog.

### 🌟 Live Demo
- **Frontend (Vercel):** [https://lms-woad-iota.vercel.app](https://lms-woad-iota.vercel.app)
- **Backend (Render):** [https://lms-aifv.onrender.com](https://lms-aifv.onrender.com)

---

## 🚀 Features

### 👨‍💼 Librarian (Admin Access)
- Secure login using a master Secret Key.
- **Manage Books:** Add new books to the inventory or delete old ones.
- **Manage Members:** Register new students/members and remove old ones.
- **Manage Loans:** Issue books to members (automatically updates available inventory) and accept returned books.
- Overdue tracking and highlighting.

### 👨‍🎓 Student / Member (Read-Only Access)
- Secure login.
- Browse the entire library catalog.
- Check real-time book availability and stock.
- View history of library loans.

---

## 🛠️ Technologies Used

- **Frontend:** React, Vite, React-Router-Dom, Axios, Vanilla CSS (Glassmorphism Dark UI)
- **Backend:** Node.js, Express.js, JWT (JSON Web Tokens), bcryptjs
- **Database:** PostgreSQL (pg)
- **Deployment:** Vercel (Frontend) & Render (Backend/Database)

---

## 💻 Local Setup & Installation

If you want to run this project locally on your machine, follow these steps:

### 1. Clone the Repository
```bash
git clone https://github.com/Vignesh-R30/LMS.git
cd LMS
```

### 2. Setup the Backend
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   npm install
   ```
2. Create a `.env` file in the `backend` folder and add your database credentials:
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
3. Start the backend server:
   ```bash
   npm run dev
   ```

### 3. Setup the Frontend
1. Open a **second** terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   npm install
   ```
2. Start the React development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173` in your browser!