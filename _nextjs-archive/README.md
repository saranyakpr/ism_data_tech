# Next.js Archive

These files are from the original Next.js App Router implementation of ISM Data Technology.
They are **not used** by the current Vite + React Router application and have been archived here
for reference and history preservation.

## Contents

| Folder | Original location | Description |
|---|---|---|
| `src-app-root/` | `src/app/layout.jsx`, `page.jsx`, `not-found.jsx`, `robots.js`, `sitemap.js` | Next.js root layout, home page, 404, robots, sitemap |
| `src-app-admin/` | `src/app/admin/` | Next.js admin pages using `next/headers`, `next/navigation` |
| `src-app-api/` | `src/app/api/` | Next.js API route handlers |
| `src-app-careers-nextjs/` | `src/app/careers/[id]/`, `src/app/careers/apply/` | Next.js server-rendered career pages |
| `src-lib-nextjs/` | `src/lib/admin-auth.ts`, `admin-api-auth.ts`, `admin-job-validation.ts`, `neon.ts`, `storage.ts` | Server-only Next.js lib files |
| `src-types/` | `src/types/database.ts` | Supabase-generated database types |
| `neon.ts` | `neon.ts` (root) | Neon branch config |
| `next.config.mjs` | `next.config.mjs` | Next.js config |
| `next-env.d.ts` | `next-env.d.ts` | Next.js TypeScript env types |
| `tsconfig.tsbuildinfo` | `tsconfig.tsbuildinfo` | TypeScript incremental build cache |

## Do not import from this folder

Nothing in the active `frontend/src/` tree imports from `_nextjs-archive/`.
