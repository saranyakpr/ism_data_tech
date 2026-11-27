import "./backend/config/env.js";
import { sql } from "./backend/config/database.js";

const rows = await sql`
  SELECT
    id,
    resume_storage_key,
    length(resume_storage_key) AS key_length
  FROM applications
  WHERE id = 'a46abeae-f57c-4a8a-99d0-2778efc24964'
`;

console.log(rows.map(row => ({
  id: row.id,
  hasStorageKey: Boolean(row.resume_storage_key),
  keyLength: row.key_length
})));
