# ALGOVISION.AI

ALGOVISION.AI is a full-stack algorithm visualizer and AI-assisted learning studio. It combines animated algorithm simulations, complexity insights, input-driven experiments, and an Ollama-powered tutor so developers and students can explore how classic algorithms behave step by step.

## What This Project Does

- Visualizes algorithms and data structures with step-by-step state transitions
- Lets users provide custom inputs and rerun simulations
- Shows complexity information alongside the active algorithm
- Includes an AI tutor panel for explanations and guided feedback
- Uses a shared simulation layer so frontend and backend stay aligned

## Supported Topics

- Binary Search
- Linear Search
- Bubble Sort
- Merge Sort
- Quick Sort
- Stack
- Queue
- Linked List
- Binary Tree
- Graph Traversal (BFS)
- Graph Traversal (DFS)

## Tech Stack

- Frontend: React 19, Vite, Tailwind CSS, Framer Motion, D3.js
- Backend: Node.js, Express
- AI integration: Ollama local API
- Package management: npm workspaces

## Repository Structure

```text
ALGOVISION/
├── backend/        # Express API, AI routes, simulation endpoints
├── frontend/       # React + Vite client
├── shared/         # Shared algorithm definitions and simulation logic
├── package.json    # Workspace scripts for local development
└── README.md
```

## Prerequisites

Make sure the following are installed before running the project:

- Node.js 18 or newer
- npm 9 or newer
- Ollama

Optional but recommended:

- Git
- A code editor such as VS Code

## Quick Start

If you want the shortest path from clone to running app:

```bash
git clone <your-repo-url>
cd ALGOVISION
npm install
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
ollama pull deepseek-coder
ollama serve
npm run dev
```

Then open:

- Frontend: `http://localhost:5173`
- Backend health check: `http://localhost:5001/api/health`

## Step-by-Step Setup For Any Developer

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd ALGOVISION
```

### 2. Install dependencies

Install all workspace dependencies from the project root:

```bash
npm install
```

This installs dependencies for:

- the root workspace
- `frontend/`
- `backend/`

### 3. Configure environment variables

Create local env files from the examples:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Default local values are already provided in the example files, so most users do not need to change anything for local development.

### 4. Install and start Ollama

If Ollama is not already installed, install it first from the official Ollama site for your OS.

Then pull the default model used by this project:

```bash
ollama pull deepseek-coder
```

Start the Ollama server:

```bash
ollama serve
```

Keep this process running in a separate terminal while using the AI tutor features.

### 5. Start the application

From the project root:

```bash
npm run dev
```

This starts:

- the backend on port `5001`
- the frontend on port `5173`

### 6. Open the app

Visit:

```text
http://localhost:5173
```

### 7. Verify the backend is healthy

Open this endpoint in your browser or terminal:

```text
http://localhost:5001/api/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "algovision-ai-backend"
}
```

## Available Scripts

From the repository root:

- `npm run dev` - starts frontend and backend together
- `npm run build` - builds the frontend and runs the backend build step
- `npm run start` - starts the backend in production mode

From `frontend/`:

- `npm run dev` - starts the Vite dev server
- `npm run build` - creates a production frontend build
- `npm run preview` - previews the production build locally

From `backend/`:

- `npm run dev` - starts the backend with file watching
- `npm run start` - starts the backend normally

## Environment Variables

### Backend

File: `backend/.env`

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `PORT` | No | `5001` | Backend server port |
| `OLLAMA_BASE_URL` | No | `http://127.0.0.1:11434` | Base URL for the local Ollama server |
| `OLLAMA_MODEL` | No | `deepseek-coder` | Ollama model used by the AI tutor |
| `CORS_ORIGIN` | No | `*` | Allowed frontend origins, comma-separated if needed |

### Frontend

File: `frontend/.env`

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `VITE_API_BASE_URL` | No | `http://localhost:5001/api` | Base URL for backend API requests |

## Local Development Workflow

### Run everything from the root

Use this when developing the full application:

```bash
npm run dev
```

### Run frontend and backend separately

Use this when you want isolated terminals:

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```

### Work on AI features

AI tutor functionality depends on Ollama being available. If Ollama is not running, the backend falls back to basic error/help responses instead of full model-generated answers.

## API Overview

Main backend routes:

- `GET /api/health`
- `GET /api/algorithms`
- `GET /api/algorithms/:id`
- `POST /api/algorithms/:id/simulate`
- `POST /api/ai/explain`
- `POST /api/ai/chat`

## Deployment Notes

### Frontend

- Config file: `frontend/vercel.json`
- Intended platform: Vercel
- Important env var: `VITE_API_BASE_URL`

### Backend

- Config file: `backend/render.yaml`
- Intended platform: Render
- Important env vars: `OLLAMA_BASE_URL`, `OLLAMA_MODEL`, `PORT`, `CORS_ORIGIN`

Before deploying, update any placeholder API URLs and make sure the frontend points to your deployed backend.

## Troubleshooting

### Frontend loads but API calls fail

Check:

- the backend is running on `http://localhost:5001`
- `frontend/.env` has the correct `VITE_API_BASE_URL`
- the backend health route responds successfully

### AI tutor is not responding

Check:

- `ollama serve` is running
- the model in `OLLAMA_MODEL` is installed
- `OLLAMA_BASE_URL` points to the correct Ollama server

You can install the default model again with:

```bash
ollama pull deepseek-coder
```

### Port conflicts

If `5001` or `5173` is already in use, change the relevant port in your env configuration and restart the servers.

## Why This README Is Developer-Oriented

This project is organized as a small workspace-based monorepo:

- `shared/` keeps algorithm definitions and simulation logic reusable
- `backend/` exposes simulation and AI endpoints
- `frontend/` renders the learning experience

That separation makes it easier to add a new algorithm, update the tutor behavior, or swap deployment targets without tightly coupling the entire app.
