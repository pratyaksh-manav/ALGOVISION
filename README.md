# ALGOVISION.AI

Full-stack learning platform for algorithm visualization, simulation, and AI tutoring.

## Stack

- Frontend: React, Vite, Tailwind CSS, Framer Motion, D3.js
- Backend: Node.js, Express.js
- AI: Ollama local API

## Project Structure

- `frontend/` React app
- `backend/` Express API
- `shared/` reusable algorithm simulation logic and content

## Local Development

1. Install dependencies:
   `npm install`
2. Copy env files:
   - `cp frontend/.env.example frontend/.env`
   - `cp backend/.env.example backend/.env`
3. Start Ollama locally and pull a model such as `deepseek-coder` or `codellama`.
4. Run the app:
   `npm run dev`

## Deployment

- Frontend: Vercel, root directory `frontend`
- Backend: Render, root directory `backend`

Environment variables:

- Frontend: `VITE_API_BASE_URL`
- Backend: `PORT`, `OLLAMA_BASE_URL`, `OLLAMA_MODEL`
