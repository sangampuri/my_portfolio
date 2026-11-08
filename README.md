# DevPort: 3D Cyberpunk Developer Portfolio

Full-stack portfolio with React 3D frontend and Django REST backend.

## Stack
- Frontend: React, Vite, Tailwind CSS, Three.js (React Three Fiber), Framer Motion
- Backend: Django, Django REST Framework, SQLite (dev)

## Features
3D hero scene, interactive 3D playground, playable Cyber Runner game,
projects/skills/journey managed from Django admin, contact form saved to database.

## Run locally

### Backend
    cd backend
    python -m venv venv
    venv\Scripts\activate
    pip install -r requirements.txt
    copy .env.example .env      (then edit values)
    python manage.py migrate
    python manage.py createsuperuser
    python manage.py seed_portfolio
    python manage.py runserver

### Frontend
    cd frontend
    npm install
    copy .env.example .env
    npm run dev

Site: http://localhost:5173  |  Admin: http://127.0.0.1:8000/admin/

## Content
Edit profile, skills, projects, journey and read contact messages in Django admin.