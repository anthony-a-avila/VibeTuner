# VibeTuner

VibeTuner is a an app that provides an “obscurity dial” for music search: instead of a recommendation engine that converges on what you already like, you choose how unexpected you want the results to be.

Type a natural-language vibe (e.g. “late-night rainy synths with soft vocals”) and tune `Obscurity` (0–100) to control how mainstream vs. obscure the results should be.

## How it works

1. You write a vibe (plain English).
2. The backend uses OpenAI's API to compress that prompt into a compact Spotify Search API query string.
3. The backend searches Spotify for up to 50 tracks, then re-sorts them by how close their obscurity is to what you requested.
   - Spotify gives each track a `popularity` score (0–100).
   - VibeTuner turns that into `obscurity = 100 - popularity`.
   - Higher obscurity ⇒ “weirder” / less mainstream results.

## Features

- Natural-language search (“describe the vibe”)
- Obscurity slider (0 = mainstream, 100 = obscure)
- Choose number of results (1–10)
- Save tracks to a local collection (SQLite)
- Favorite/unfavorite saved tracks
- Dark mode

## Tech stack

- **Frontend:** React + TypeScript + Vite (with a dev proxy to the backend)
- **Backend:** Node.js + TypeScript + Express
- **APIs:** Spotify Web API, OpenAI API
- **Storage:** SQLite (`backend/vibetuner.db`)

## Getting started (local dev)

### Prerequisites

- Node.js (18+ recommended)
- Spotify developer app credentials (Client ID + Client Secret)
- OpenAI API key

### 1) Backend env vars

Create `backend/.env`:

```bash
OPENAI_API_KEY=...
SPOTIFY_CLIENT_ID=...
SPOTIFY_CLIENT_SECRET=...

# Optional: set to "false" to disable calling Spotify (the /api/search response shape changes) for frontend testing
USE_SPOTIFY=true
```

### 2) Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 3) Run the app

In one terminal:

```bash
cd backend
npm run dev
```

In another terminal:

```bash
cd frontend
npm run dev
```

Then open the Vite dev server (usually `http://localhost:5173`).

Note: `frontend/vite.config.ts` proxies `/api/*` to the backend at `http://localhost:3001`.

## Scripts

Backend (from `backend/`):

- `npm run dev` — run the API with nodemon + ts-node
- `npm run build` — compile TypeScript to `backend/dist/`
- `npm start` — run the compiled server (`backend/dist/index.js`)

Frontend (from `frontend/`):

- `npm run dev` — start Vite
- `npm run build` — typecheck + production build
- `npm run preview` — serve the production build locally

## Project structure

```text
frontend/   # React UI (Vite)
backend/    # Express API + SQLite + Spotify/OpenAI integration
```

## API (backend)

- `POST /api/search`
  - Body: `{ "query": string, "numResults": number, "obscurity": number }`
  - Returns (when `USE_SPOTIFY=true`): `{ baseQuery, spotifyQuery, desiredObscurity, tracks }`
  - Returns (when `USE_SPOTIFY=false`): `{ baseQuery, spotifyQuery }` (no `tracks`)
- `GET /api/collection` — list saved tracks
- `POST /api/collection` — save a track
- `PATCH /api/collection/:id/favorite` — toggle favorite
- `DELETE /api/collection/:id` — remove a track

## Offline / mock mode (frontend only)

If you want to run the UI without the backend, flip `USE_BACKEND` in `frontend/src/appMode.ts` to `false` (the UI will generate dummy results).

## Troubleshooting

- Backend crashes on startup: make sure `backend/.env` has `OPENAI_API_KEY`, `SPOTIFY_CLIENT_ID`, and `SPOTIFY_CLIENT_SECRET`.
- If search returns nothing, try lowering obscurity (more mainstream results are easier to match) or broaden the vibe description.
