# CLI-Based Project & Task Management System 🚀

A **backend-focused, workflow-driven project management system** inspired by Jira and GitHub, built completely from scratch using **Node.js, Express, MySQL, and a custom CLI**.

This project demonstrates **real-world backend engineering concepts** such as authentication, authorization, ownership checks, workflow enforcement, and system-driven state transitions — without relying on ORMs or frontend frameworks.

---

## 📌 Table of Contents

- Key Highlights
- Tech Stack
- System Roles
- Workflow Overview
- Database Schema
- Setup Instructions
- CLI Commands
- Authorization Rules
- Error Handling
- What This Project Demonstrates
- Future Improvements

---

## ✨ Key Highlights

- 🔐 Role-based Authentication (Manager / Developer)
- 🧱 Resource-level Authorization (Projects, Tasks, PRs)
- 👥 Team-based Access Control
- 📋 Task Lifecycle Enforcement
- 🔀 Pull Request Workflow (Approve / Reject / Merge)
- 🚀 Deployment Simulation
- 💻 CLI as Frontend (Commander.js)
- 🧪 Production-grade Error Handling

---

## 🛠 Tech Stack

### Backend
- Node.js (JavaScript)
- Express.js
- MySQL
- mysql2 (Raw SQL – no ORM)
- JWT (jsonwebtoken)
- bcrypt
- dotenv

### CLI
- Commander.js
- Axios

### Environment
- Windows (PowerShell)

---

## 🧠 System Roles

### 👔 Manager
- Create projects
- Create and assign tasks
- Review PRs (approve / reject / merge)
- Complete tasks and projects
- Deploy completed projects

### 👨‍💻 Developer
- View assigned tasks
- Start tasks (`IN_PROGRESS`)
- Raise Pull Requests

---

## 🔁 Workflow Overview

### 📋 Task Lifecycle

**TODO → IN_PROGRESS → (PR Raised) → IN_REVIEW → DONE**


- Developers can only move tasks to `IN_PROGRESS`
- Tasks move to `IN_REVIEW` automatically when a PR is raised
- Tasks move to `DONE` only after a PR is merged

---

### 🔀 Pull Request Lifecycle



**OPEN → APPROVED → MERGED**
**OPEN → REJECTED**


- Only one OPEN PR allowed per task
- PR lifecycle strictly controls task state
- Managers cannot manually complete tasks

---

### 🚀 Deployment Lifecycle

- Only COMPLETED projects can be deployed
- Deployment is simulated with delay and success/failure
- Deployment history is recorded for audit purposes

---

## 🗄 Database Schema (High Level)

- `users` – Managers & Developers
- `teams` – One team per manager
- `team_members` – Developers in a team
- `projects` – Owned by managers
- `tasks` – Assigned to developers
- `pull_requests` – PR lifecycle
- `deployments` – Deployment history

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone <your-repo-url>
cd cli-task-manager
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment

Create .env file:

```bash
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=cli_task_manager
JWT_SECRET=your_secret_key
```

### 4️⃣ Setup Database

- Create MySQL database
- Run provided SQL schema files
- Ensure foreign keys are enabled

### 5️⃣ Start Backend Server

```bash
npm run dev
# or
npm start
```

### 6️⃣ Link CLI

```bash
npm link
```

Now you can use:

```bash
pm --help
```

## CLI Commands

### 🔐 Authentication

```bash
pm register --name Manager --email m@gmail.com --password 12345 --role MANAGER
pm login --email m@gmail.com --password 12345
```

```bash
pm register --name Dev --email d@gmail.com --password 12345 --role DEVELOPER --teamId 1
```

### 📁 Project (Manager)

```bash
pm project:create --name "CLI Tool" --description "Backend system"
pm project:list
pm project:complete --projectId 1
```

### 📋 Tasks

```bash
pm task:create --title "Auth Module" --projectId 1
pm task:assign --taskId 1 --developerId 3 --projectId 1
pm task:list:manager --projectId 1
```

```bash
pm task:list
pm task:update --taskId 1 --status IN_PROGRESS
```

### 🔀 Pull Requests

```bash
pm pr:create --taskId 1
pm pr:list --projectId 1
pm pr:approve --prId 1
pm pr:merge --prId 1
```

### 🚀 Deployment

```bash
pm project:deploy --projectId 1 --deployVersion v1.2.0
```

### 🛡 Authorization Rules (Summary)
-  Managers can manage only their own projects
- Developers can access only assigned tasks
- PR approval restricted to project owner
- Tasks cannot be completed without merged PR
- Projects cannot be completed unless all tasks are DONE

### 🧪 Error Handling
- Backend returns meaningful HTTP errors
- CLI displays exact backend error messages
- Network/server issues handled gracefully
- Example:
```bash
❌ Project must be COMPLETED before deployment
```

### 🎯 What This Project Demonstrates
- Backend system design
- Authorization beyond simple role checks
- State-machine driven workflows
- Clean separation of concerns
- CLI as a thin client
- Debugging real production issues

<!-- ### 🚀 Future Improvements (Optional)
- Messaging between Manager & Developer
- CI/CD integration
- Deployment logs & rollback
- Pagination & filtering
- Unit & integration tests -->

### 👤 Author
**Vighnesh Shinde**

### 📌 Final Note
This project was intentionally built without ORMs or frontend frameworks to focus on core backend engineering skills.