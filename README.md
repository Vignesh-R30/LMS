# LMS
LIBRARY MANAGEMENT SYSTEM
# 📚 Library Management System (LMS)

A small full-stack Library Management System developed as an SED/Software Engineering laboratory project.

The system allows librarians and students/members to manage books, members, issuing, returning and searching books.

---

# 🚀 1. Project Overview

The Library Management System provides the following features:

### 👨‍💼 Librarian
- Login
- Add books
- Edit books
- Delete books
- View all books
- Search books
- Add members
- View members
- Issue books
- Return books
- View issued books
- View overdue books

### 👨‍🎓 Student / Member
- Login
- View available books
- Search books
- View issued books
- View due dates

---

# 🛠️ 2. Technologies Used

## Frontend

- React
- Vite
- JavaScript
- HTML
- CSS

## Backend

- Node.js
- Express.js
- REST API

## Database

- PostgreSQL

## Database Management

- pgAdmin 4

## Version Control

- Git
- GitHub

---

# 📁 3. Project Structure

The project will have the following structure:

LMS/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── config/
│   │   └── server.js
│   │
│   ├── .env
│   ├── package.json
│   └── README.md
│
├── database/
│   └── schema.sql
│
├── .gitignore
└── README.md

---

# 💻 4. Requirements

Install the following software:

1. Node.js
2. Git
3. PostgreSQL
4. pgAdmin 4
5. VS Code

Check Node.js:

node --version

Check npm:

npm --version

Check Git:

git --version

---

# 📥 5. Clone the Project

Open PowerShell.

Go to Desktop:

cd $HOME\Desktop

Clone the repository:

git clone https://github.com/Vignesh-R30/LMS.git

Enter the project:

cd LMS

Check Git status:

git status

---

# 🌿 6. Git Branch Setup

Never directly work on the main branch.

Create your own feature branch.

Example:

git checkout -b feature/setup

Check the current branch:

git branch

You should see:

* feature/setup
  main

---

# 🎨 7. Frontend Setup

The frontend is created using Vite and React.

Enter the LMS folder:

cd $HOME\Desktop\LMS

Create the frontend:

npm.cmd create vite@latest frontend -- --template react

Enter frontend:

cd frontend

Install dependencies:

npm.cmd install

Install routing and API tools:

npm.cmd install react-router-dom axios

Start the frontend:

npm.cmd run dev

The frontend will normally run at:

http://localhost:5173

Open the address in your browser.

---

# ⚠️ 8. PowerShell npm Error

If PowerShell shows:

npm.ps1 cannot be loaded because running scripts is disabled on this system

Use:

npm.cmd

instead of:

npm

Example:

npm.cmd install

npm.cmd run dev

npm.cmd create vite@latest frontend -- --template react

This avoids the PowerShell execution-policy problem.

---

# 🔧 9. Backend Setup

Open another terminal.

Go to the LMS folder:

cd $HOME\Desktop\LMS

Create the backend folder:

mkdir backend

Enter backend:

cd backend

Create package.json:

npm.cmd init -y

Install Express:

npm.cmd install express

Install PostgreSQL support:

npm.cmd install pg

Install environment variable support:

npm.cmd install dotenv

Install CORS:

npm.cmd install cors

Install password encryption:

npm.cmd install bcryptjs

Install JWT authentication:

npm.cmd install jsonwebtoken

Install development tool:

npm.cmd install --save-dev nodemon

---

# 📦 10. Backend Dependencies

The backend uses:

- express
- pg
- dotenv
- cors
- bcryptjs
- jsonwebtoken
- nodemon

---

# ⚙️ 11. Backend package.json

Open:

backend/package.json

Change the scripts section to:

"scripts": {
  "start": "node src/server.js",
  "dev": "nodemon src/server.js"
}

---

# 📁 12. Create Backend Folders

Inside backend create:

src

Inside src create:

controllers
routes
models
middleware
config

Final structure:

backend/
│
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── config/
│   └── server.js
│
├── .env
└── package.json

---

# 🗄️ 13. PostgreSQL Database

Open pgAdmin 4.

Create a new database.

Database name:

lms_db

Example:

Servers
└── PostgreSQL
    └── Databases
        └── lms_db

---

# 🔐 14. PostgreSQL Username and Password

During PostgreSQL installation, you created a PostgreSQL password.

Usually:

Username:

postgres

Password:

YOUR_POSTGRES_PASSWORD

Port:

5432

Do NOT upload your password to GitHub.

---

# 🔑 15. Backend .env File

Inside:

backend/

create:

.env

Add:

PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=lms_db
DB_USER=postgres
DB_PASSWORD=YOUR_POSTGRES_PASSWORD

JWT_SECRET=change_this_to_a_random_secret

Example:

PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=lms_db
DB_USER=postgres
DB_PASSWORD=123456

JWT_SECRET=my_lms_secret_key

IMPORTANT:

Never commit .env to GitHub.

---

# 🚫 16. .gitignore

Create:

.gitignore

Add:

node_modules/
.env
dist/
*.log

This prevents sensitive files and unnecessary files from being uploaded.

---

# 🏗️ 17. Database Tables

The LMS will use the following main tables:

users
books
members
loans

Relationship:

Users
  |
  └── Authentication

Members
  |
  └── Loans
       |
       └── Books

---

# 📚 18. Database Schema

Create:

database/schema.sql

Add:

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'member',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    author VARCHAR(150) NOT NULL,
    isbn VARCHAR(50) UNIQUE,
    category VARCHAR(100),
    quantity INTEGER DEFAULT 1,
    available_quantity INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE loans (
    id SERIAL PRIMARY KEY,
    book_id INTEGER REFERENCES books(id),
    member_id INTEGER REFERENCES members(id),
    issue_date DATE DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    return_date DATE,
    status VARCHAR(20) DEFAULT 'issued'
);

---

# ▶️ 19. Running schema.sql

Open pgAdmin.

Select:

lms_db

Open:

Query Tool

Copy the contents of:

database/schema.sql

Paste it into Query Tool.

Click:

Execute

The tables should be created.

---

# 🔌 20. PostgreSQL Connection

Create:

backend/src/config/database.js

Add:

const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

module.exports = pool;

---

# 🖥️ 21. Backend Server

Create:

backend/src/server.js

Add:

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Library Management System API is running"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

---

# ▶️ 22. Start Backend

Open PowerShell.

Go to backend:

cd $HOME\Desktop\LMS\backend

Start development server:

npm.cmd run dev

You should see:

Server running on port 5000

Open:

http://localhost:5000

You should get:

{
  "message": "Library Management System API is running"
}

---

# 🌐 23. Frontend and Backend

Two terminals should normally be running.

Terminal 1:

cd $HOME\Desktop\LMS\frontend

npm.cmd run dev

Frontend:

http://localhost:5173

Terminal 2:

cd $HOME\Desktop\LMS\backend

npm.cmd run dev

Backend:

http://localhost:5000

---

# 🔗 24. Backend API Structure

The backend will provide REST APIs.

## Authentication

POST /api/auth/register

POST /api/auth/login

## Books

GET /api/books

GET /api/books/:id

POST /api/books

PUT /api/books/:id

DELETE /api/books/:id

## Members

GET /api/members

POST /api/members

PUT /api/members/:id

DELETE /api/members/:id

## Loans

GET /api/loans

POST /api/loans/issue

PUT /api/loans/:id/return

---

# 📚 25. Book Management

The librarian can:

- Add a book
- Update a book
- Delete a book
- Search books
- View books
- Check availability

Example book:

Title:

Java Programming

Author:

James Gosling

ISBN:

9781234567890

Category:

Programming

Quantity:

5

Available:

5

---

# 👨‍🎓 26. Member Management

The librarian can add members.

Example:

Name:

Vignesh

Email:

vignesh@example.com

Phone:

9876543210

---

# 📖 27. Issue Book

When a book is issued:

1. Select member
2. Select book
3. Enter due date
4. Click Issue

The system should:

- Create a loan
- Reduce available quantity
- Change loan status to "issued"

Example:

Book quantity = 5

Available quantity = 5

After issuing:

Available quantity = 4

---

# 🔄 28. Return Book

When a member returns a book:

1. Find the loan
2. Click Return

The system should:

- Set return date
- Change status to "returned"
- Increase available quantity

Example:

Available quantity = 4

After return:

Available quantity = 5

---

# 🔎 29. Search

The system should allow searching by:

- Book title
- Author
- ISBN
- Category

Example:

Search:

Java

Possible result:

Java Programming
Java Complete Reference
Advanced Java

---

# ⏰ 30. Overdue Books

A book is overdue when:

Current date > due date

AND

return_date is NULL

The librarian should be able to see:

Member
Book
Issue Date
Due Date
Days Overdue

---

# 🔐 31. Authentication

The application will use:

JWT authentication.

Passwords should never be stored as plain text.

Passwords are encrypted using:

bcryptjs

Login flow:

User
 ↓
Login form
 ↓
Backend
 ↓
Check email
 ↓
Compare password
 ↓
Generate JWT
 ↓
Frontend stores authentication state
 ↓
User accesses dashboard

---

# 🖥️ 32. Frontend Pages

The React application should contain:

Login

Register

Dashboard

Books

Add Book

Edit Book

Members

Add Member

Issue Book

Return Book

Issued Books

Overdue Books

Profile

---

# 📊 33. Dashboard

The dashboard can display:

Total Books

Available Books

Total Members

Issued Books

Overdue Books

Example:

----------------------------------
        LIBRARY DASHBOARD
----------------------------------

Total Books       : 250

Available Books   : 180

Members           : 120

Issued Books      : 70

Overdue Books     : 8

----------------------------------

---

# 👨‍💻 34. Git Workflow for Team

IMPORTANT:

Everyone should NOT directly edit main.

Each team member should create their own branch.

Example:

main

feature/frontend

feature/backend

feature/database

feature/authentication

feature/books

feature/loans

---

# 🌿 35. Create Your Branch

Example:

git checkout -b feature/books

Check:

git branch

---

# 💾 36. Save Changes

After making changes:

git status

Add files:

git add .

Commit:

git commit -m "Add book management"

Push:

git push -u origin feature/books

---

# 🔄 37. Get Latest Changes

Before starting work:

git checkout main

git pull origin main

Then return to your branch:

git checkout feature/books

Update your branch:

git merge main

---

# 🔀 38. Pull Request

After completing your feature:

git add .

git commit -m "Complete book management"

git push -u origin feature/books

Go to GitHub.

You will see:

Compare & pull request

Create the Pull Request.

Another team member can review it.

After checking the code, merge it into main.

---

# 👥 39. Suggested Team Division

For a 4-member team:

Member 1:

Frontend / UI

Branch:

feature/frontend

Member 2:

Backend / API

Branch:

feature/backend

Member 3:

Database / PostgreSQL

Branch:

feature/database

Member 4:

Authentication + Testing

Branch:

feature/auth

---

# ⚠️ 40. Important Git Rules

DO NOT work directly on main.

DO NOT commit .env.

DO NOT commit node_modules.

DO NOT use:

git push --force

unless the team specifically agrees.

Always pull before starting work.

Always commit with a meaningful message.

Example:

GOOD:

git commit -m "Add book search feature"

BAD:

git commit -m "changes"

---

# 🧪 41. Testing

Test the following:

### Authentication

- Register
- Login
- Wrong password
- Invalid email

### Books

- Add book
- Edit book
- Delete book
- Search book
- Check availability

### Members

- Add member
- Edit member
- Delete member

### Loans

- Issue book
- Return book
- Prevent issuing unavailable book
- Check overdue book

---

# 🛡️ 42. Important Validation

The backend should prevent:

- Issuing unavailable books
- Duplicate ISBN
- Duplicate member email
- Empty book names
- Invalid email
- Invalid due dates

---

# 🧰 43. Useful Commands

Go to Desktop:

cd $HOME\Desktop

Go to LMS:

cd $HOME\Desktop\LMS

Go to frontend:

cd frontend

Go to backend:

cd backend

Go back one folder:

cd ..

List files:

dir

Git status:

git status

Git branches:

git branch

Pull changes:

git pull

Create branch:

git checkout -b feature/name

Switch branch:

git checkout branch-name

Add changes:

git add .

Commit:

git commit -m "message"

Push:

git push -u origin branch-name

---

# 🚀 44. Complete Startup Procedure

Every time you want to work on the project:

### Terminal 1

cd $HOME\Desktop\LMS

git pull origin main

cd frontend

npm.cmd install

npm.cmd run dev

---

### Terminal 2

cd $HOME\Desktop\LMS

cd backend

npm.cmd install

npm.cmd run dev

---

### Browser

Open:

http://localhost:5173

---

# 🧑‍💻 45. Development Workflow

Use this workflow:

1. Pull latest main
2. Create/switch to your feature branch
3. Write code
4. Test locally
5. git status
6. git add .
7. git commit
8. git push
9. Create Pull Request
10. Review
11. Merge into main

---

# 🏆 46. Final Project Features

The completed LMS should provide:

✅ Login/Register

✅ Role-based access

✅ Dashboard

✅ Book management

✅ Member management

✅ Search

✅ Issue books

✅ Return books

✅ Due dates

✅ Overdue tracking

✅ PostgreSQL database

✅ REST API

✅ React frontend

✅ GitHub collaboration

✅ Input validation

✅ Error handling

---

# 📌 47. Technologies Summary

| Component | Technology |
|---|---|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| Database GUI | pgAdmin 4 |
| Authentication | JWT |
| Password Security | bcrypt |
| API | REST |
| Version Control | Git |
| Repository | GitHub |

---

# ❌ 48. MongoDB

MongoDB is NOT required for this project.

We are using PostgreSQL because:

- Library data is relational
- Books and members have relationships
- Loans connect books and members
- PostgreSQL works well with structured data
- pgAdmin makes database management easy

Therefore:

PostgreSQL + pgAdmin

is enough.

---

# 🤖 49. Antigravity / OpenCode

Antigravity or OpenCode can be used as coding assistants.

They are NOT required to run the LMS.

They can help with:

- Generating React components
- Creating Express routes
- Finding bugs
- Explaining code
- Writing tests
- Improving UI

However, all generated code should be reviewed and tested before committing it.

---

# 🎯 50. Project Goal

The final system should behave like a real library management application.

User

↓

Login

↓

Dashboard

↓

Search Book

↓

Check Availability

↓

Issue Book

↓

Database Updated

↓

Return Book

↓

Database Updated

↓

Book Available Again

---

# 📞 51. Troubleshooting

## npm.ps1 error

Use:

npm.cmd install

instead of:

npm install

---

## Port 5173 already in use

Stop the existing Vite server using:

Ctrl + C

Then:

npm.cmd run dev

---

## Backend port already in use

Stop the existing Node process or change:

PORT=5000

in .env.

---

## PostgreSQL connection error

Check:

1. PostgreSQL service is running
2. Database name is correct
3. Username is correct
4. Password is correct
5. Port is 5432
6. .env exists inside backend

---

# ✅ Final Check

Before submitting the project:

Frontend works:

http://localhost:5173

Backend works:

http://localhost:5000

Database works:

PostgreSQL / pgAdmin

GitHub contains:

frontend/

backend/

database/

README.md

.gitignore

No:

node_modules/

.env

should be uploaded to GitHub.

---

# 👨‍💻 Project Team

Library Management System

Developed as a Software Engineering / SED Laboratory Project.

Repository:

https://github.com/Vignesh-R30/LMS