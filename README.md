# AI Interview Preparation Platform

A complete, working, deployable full-stack application that uses AI to simulate dynamic tech interviews based on user resumes.

## Features
- **Resume Parsing**: Extracts context from PDF/DOCX to ground the AI.
- **Dynamic Quizzes**: Generates MCQ, Coding, and Essay questions tailored to your target role and company.
- **Evaluation**: AI grades your answers and provides actionable feedback.
- **Roadmap**: Generates a customized learning path based on your exact interview performance.
- **Themes**: Switch between 6 stunning UI themes instantly.

## Architecture
- **Backend**: Flask, SQLite, JWT Auth, PyPDF2, OpenAI SDK
- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Anime.js, Axios

## Setup Instructions

### 1. Backend Setup
1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   # Windows:
   venv\Scripts\activate
   # Mac/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up environment variables:
   Copy `.env.example` to `.env` and **add your OpenAI API Key**.
   ```bash
   OPENAI_API_KEY=sk-...
   JWT_SECRET_KEY=pick_a_secure_random_string
   ```
5. Run the server:
   ```bash
   python app.py
   ```
   *The server will start on http://localhost:5000 and automatically initialize the SQLite database.*

### 2. Frontend Setup
1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies (if not already done):
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open the displayed URL (usually `http://localhost:5173`) in your browser.

## Deployment
- **Frontend**: Run `npm run build` to generate the `dist` folder. Host it on Vercel, Netlify, or serve it via a static file server.
- **Backend**: Can be deployed to Heroku, Render, or AWS Elastic Beanstalk using standard Flask deployment wsgi configs (e.g. Gunicorn). Make sure the SQLite database path is persistent or migrate to Postgres.
