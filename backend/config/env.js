import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import dotenv from "dotenv";

// Resolve .env.local from the repo root regardless of the working directory
// from which the backend is started (e.g. `cd backend && node server.js`
// or `node backend/server.js` from the project root both work).
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// backend/config/env.js  →  ../../.env.local  →  <repo-root>/.env.local
const envPath = resolve(__dirname, "../../.env.local");

dotenv.config({ path: envPath });
