# ATOMQUEST GOAL PORTAL

ATOMQUEST GOAL PORTAL is a modern goal and productivity management platform designed to help users organize goals, monitor progress, manage tasks, and analyze productivity through a clean dashboard-based interface.

The project is built using React and Vite for the frontend, with a scalable architecture that supports backend integration, analytics, authentication, and deployment pipelines.

---

# Features

* User Authentication
* Dashboard Overview
* Goal Management
* Task & Habit Tracking
* Analytics and Reports
* Approval Management
* Admin Panel
* Responsive UI
* State Management using Context API
* Modular Component-Based Architecture

---

# Tech Stack

## Frontend

* React.js
* Vite
* Tailwind CSS
* Context API

## Backend

* Node.js
* Express.js

## Database

* MongoDB Atlas

## Deployment

* GitHub
* Vercel
* Render

---

# Project Structure

```bash
ATOMQUEST-GOAL-PORTAL/
│
├── public/
│
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Layout.jsx
│   │   └── ui.jsx
│   │
│   ├── data/
│   │   └── seed.js
│   │
│   ├── lib/
│   │   ├── scoring.js
│   │   ├── utils.js
│   │   └── validation.js
│   │
│   ├── pages/
│   │   ├── Admin.jsx
│   │   ├── Analytics.jsx
│   │   ├── Approvals.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Goals.jsx
│   │   ├── Login.jsx
│   │   └── Reports.jsx
│   │
│   ├── store/
│   │   └── AppContext.jsx
│   │
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

---

# Architecture Overview

The application follows a modular full-stack architecture:

1. User interacts with the React frontend.
2. Frontend sends API requests to the backend server.
3. Backend processes authentication, goals, tasks, analytics, and business logic.
4. MongoDB Atlas stores user and application data.
5. Deployment pipeline uses GitHub for version control, Vercel for frontend hosting, and Render for backend hosting.

---

# Installation

## Clone Repository

```bash
git clone https://github.com/ashxta/ATOMQUEST-GOAL-PORTAL.git
```

## Navigate to Project

```bash
cd ATOMQUEST-GOAL-PORTAL
```

## Install Dependencies

```bash
npm install
```

## Run Development Server

```bash
npm run dev
```

---

# Build for Production

```bash
npm run build
```



# Future Enhancements

* AI-Based Productivity Suggestions
* Real-Time Notifications
* Team Collaboration Features
* Advanced Analytics Dashboard
* Calendar Integration
* Dark Mode Support

---

# Author

Ashita 

GitHub:
[ashxta](https://github.com/ashxta?utm_source=chatgpt.com)
