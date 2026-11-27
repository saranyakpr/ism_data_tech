import "./backend/config/env.js";
import { sql } from "./backend/config/database.js";

const rows = await sql`
  SELECT
    id,
    full_name,
    submitted_at,
    resume_storage_key
  FROM applications
  ORDER BY submitted_at DESC
  LIMIT 5
`;

console.log(rows.map(row => ({
  id: row.id,
  submittedAt: row.submitted_at,
  hasStorageKey: Boolean(row.resume_storage_key)
})));
