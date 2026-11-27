import "./env.js";
import { neon } from "@neondatabase/serverless";

const connectionString = process.env.NEON_TARGET_DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "Neon configuration error: NEON_TARGET_DATABASE_URL is required."
  );
}

export const sql = neon(connectionString);