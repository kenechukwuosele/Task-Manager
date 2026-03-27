# ✅ Taskly — MERN Task Manager (React + Node/Express + MongoDB)

Taskly is a full‑stack task management app built with the **MERN stack**. It helps users stay organized with a clean UI, authentication, and straightforward task workflows (create, prioritize, complete).

**Live Demo:** https://task-manager-frontend-1v6f.onrender.com

---

## 🧩 Problem

Most task apps either:
- feel bloated with too many features, or
- don’t have secure accounts and persistence, or
- become hard to maintain as the codebase grows.

Taskly focuses on the essentials: **fast task capture + clear visibility + secure access**, without unnecessary complexity.

---

## 🛠️ Approach

- **MERN architecture** for end-to-end JavaScript development
- **Frontend (`frontend/`)**: a responsive React UI built with Vite
- **Backend (`backend/`)**: an Express API handling auth + task operations
- **MongoDB + Mongoose** for persistence and schema modeling
- Modular folder structure to keep features isolated and maintainable

---

## 📈 Impact

- Users can reliably manage tasks from any device (responsive UI)
- Task data persists across sessions and devices
- A clean full-stack starter that can scale into:
  - shared task lists,
  - team collaboration,
  - reminders / calendar integrations,
  - analytics and productivity insights

---

## ✨ Features

- **Auth**: user registration + login
- **Task CRUD**: create, edit, delete tasks
- **Priority levels**: `Low`, `Medium`, `High`
- **Status**: pending vs completed (where implemented)
- **Responsive UI**

---

## 🧱 Tech Stack

- **Frontend:** React (Vite)
- **Styling:** Tailwind CSS (if configured in the frontend)
- **Backend:** Node.js + Express
- **Database:** MongoDB + Mongoose

---

## 🗂️ Repo Structure (important)

```text
Task-Manager/
├── frontend/      # React (Vite) app
└── backend/       # Express API + DB models
```

---

## ✅ Prerequisites

- Node.js 18+ recommended
- MongoDB (local or Atlas)

---

## 🚀 Run Locally

### 1) Clone
```bash
git clone https://github.com/kenechukwuosele/Task-Manager.git
cd Task-Manager
```

### 2) Backend
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```

Run:
```bash
npm run dev
# or
npm start
```

### 3) Frontend
```bash
cd ../frontend
npm install
npm run dev
```

Frontend will typically run on `http://localhost:5173`.

---

## 🌍 Deployment

See `DEPLOYMENT.md`.

---

## 🤝 Contributing

PRs are welcome. Please include:
- what you changed
- how to test it
- screenshots for UI changes

---

## 📄 License

Add a `LICENSE` file if you want open-source usage terms.