import { sql } from "../config/database.js";
import { downloadLifeAtISMImage } from "../config/storage.js";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getLifeAtISMImage(req, res) {
  try {
    const { id } = req.params;

    if (!UUID_RE.test(id)) {
      return res.status(404).json({
        error: "Image not found.",
      });
    }

    const rows = await sql`
      SELECT storage_key, content_type
      FROM life_at_ism
      WHERE id = ${id}
        AND is_published = TRUE
        AND storage_key IS NOT NULL
      LIMIT 1
    `;

    const row = rows[0];

    if (!row?.storage_key) {
      return res.status(404).json({
        error: "Image not found.",
      });
    }

    if (!ALLOWED_TYPES.has(row.content_type)) {
      return res.status(415).json({
        error: "Invalid image type.",
      });
    }

    const buffer = await downloadLifeAtISMImage(row.storage_key);

    res.set({
      "Content-Type": row.content_type,
      "Content-Length": String(buffer.length),
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      "X-Content-Type-Options": "nosniff",
    });

    return res.status(200).send(buffer);
  } catch (error) {
    console.error(
      "Life at ISM image load error:",
      error instanceof Error ? error.message : "Unknown"
    );

    return res.status(500).json({
      error: "Unable to load image.",
    });
  }
}