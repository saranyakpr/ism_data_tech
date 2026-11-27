import { sql } from "../config/database.js";

export async function getPublicLifeAtISMPhotos(req, res) {
  try {
    const rows = await sql`
      SELECT
        id,
        title,
        caption,
        category,
        image_path,
        storage_key,
        is_legacy,
        is_published,
        sort_order
      FROM life_at_ism
      WHERE is_published = TRUE
      ORDER BY sort_order ASC, created_at ASC
    `;

    const photos = rows.map((row) => ({
      id: row.id,
      title: row.title,
      caption: row.caption ?? "",
      category: row.category,
      is_legacy: row.is_legacy,
      is_published: row.is_published,
      sort_order: row.sort_order,
      image_url: row.is_legacy
        ? row.image_path ?? ""
        : `/api/life-at-ism/${row.id}/image`,
    }));

    return res.status(200).json({ photos });
  } catch (error) {
    console.error(
      "Life at ISM public route error:",
      error instanceof Error ? error.message : "Unknown"
    );

    return res.status(500).json({
      error: "Unable to load gallery.",
    });
  }
}