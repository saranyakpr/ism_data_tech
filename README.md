# ISM Data Technology

Corporate website for ISM Data Technology — a data management and IT-enabled services company.

## Architecture

```
ism-data-tech/
├── frontend/        Vite + React SPA (public website + admin portal)
├── backend/         Node.js + Express API server
├── _nextjs-archive/ Archived Next.js files (not in active use)
├── backups/         Database backup files
├── check-*.mjs      Dev utility scripts (run from repo root)
├── .env.local        ← SECRET: never committed, never displayed
└── .neon             ← SECRET: never committed
```

## Quick Start

You need **two terminals**.

### Terminal 1 — Backend (Express on port 3001)

```bash
cd backend
npm install
node server.js
# → ISM Backend running at http://localhost:3001
```

Or with file-watching during development:
```bash
cd backend
npm run dev
```

### Terminal 2 — Frontend (Vite on port 5173)

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

The Vite dev server proxies all `/api/*` requests to the backend on port 3001.

## Production Build

```bash
cd frontend
npm run build
# Output: frontend/dist/
```

## Environment Variables

Copy `.env.local.example` to `.env.local` at the repo root and fill in all values.
The backend loads `.env.local` automatically via `backend/config/env.js` using an
absolute path resolution — it works regardless of which directory you start the backend from.

**Never commit `.env.local` or `.neon`.**

## Dev Utility Scripts

Run from the repo root:

```bash
node check-admin-env.mjs        # Verify admin env vars are configured
node check-auth-config.mjs      # Validate admin auth config
node check-hash.mjs             # Check bcrypt hash format
node check-recent-resume-keys.mjs  # List recent application storage keys
node check-resume-key.mjs       # Check a specific resume storage key
```

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/jobs` | List published jobs |
| GET | `/api/jobs/:id` | Get single published job |
| POST | `/api/careers/apply` | Submit job application |
| GET | `/api/life-at-ism` | List published gallery photos |
| POST | `/api/contact` | Submit contact form |
| POST | `/api/admin/auth/login` | Admin login |
| POST | `/api/admin/auth/logout` | Admin logout |
| GET | `/api/admin/overview` | Dashboard stats |
| GET/POST | `/api/admin/jobs` | Manage jobs |
| PATCH | `/api/admin/jobs/:id` | Update job |
| GET | `/api/admin/applications` | List applications |
| PATCH | `/api/admin/applications/:id` | Update application status |
| GET | `/api/admin/applications/:id/resume` | Download resume |
| GET/POST/PATCH/DELETE | `/api/admin/life-at-ism` | Manage gallery |

## Git Remotes

```bash
git remote -v
# origin    https://github.com/saranyakpr/ism_data_tech.git
# personal  https://github.com/niranjana221105/ism-data-tech.git
```

## Tech Stack

**Frontend:** React 19, Vite 8, React Router 7, Tailwind CSS 3, Framer Motion 14, Lucide React
**Backend:** Node.js, Express 5, Neon (PostgreSQL), AWS S3-compatible storage, Resend (email), bcryptjs, multer, zod
