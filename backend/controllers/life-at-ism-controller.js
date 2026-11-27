import { randomUUID } from "node:crypto";

import { sql } from "../config/database.js";

import {
  uploadLifeAtISMImage,
  deleteLifeAtISMImage,
} from "../config/storage.js";

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const VALID_CATEGORIES = [
  "brainstorming",
  "cultural",
  "outing",
  "fun",
];

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  export async function getLifeAtISMPhotos(req, res) {
  try {
    const rows = await sql`
      SELECT
        id, title, caption, category,
        image_path, storage_key, content_type,
        is_legacy, is_published, sort_order,
        created_at, updated_at
      FROM life_at_ism
      ORDER BY sort_order ASC, created_at ASC
    `;

    const photos = rows.map((row) => ({
      id: row.id,
      title: row.title,
      caption: row.caption ?? "",
      category: row.category,
      image_path: row.image_path,
      is_legacy: row.is_legacy,
      is_published: row.is_published,
      sort_order: row.sort_order,
      created_at: row.created_at,
      updated_at: row.updated_at,
      image_url: row.is_legacy
        ? (row.image_path ?? "")
        : `/api/life-at-ism/${row.id}/image`,
    }));

    return res.status(200).json({ photos });
  } catch (error) {
    console.error(
      "Admin life-at-ism GET error:",
      error instanceof Error ? error.message : "Unknown"
    );

    return res.status(503).json({
      error: "Unable to load gallery photos.",
    });
  }
}
export async function uploadLifeAtISMPhoto(req, res) {
  const { title, caption = "", category } = req.body ?? {};
  const imageFile = req.file;

  if (typeof title !== "string" || !title.trim() || title.trim().length > 150) {
    return res.status(400).json({
      error: "Photo title is required (max 150 characters).",
    });
  }

  if (
    typeof category !== "string" ||
    !VALID_CATEGORIES.includes(category.trim())
  ) {
    return res.status(400).json({ error: "Invalid category." });
  }

  if (typeof caption !== "string") {
    return res.status(400).json({ error: "Invalid caption." });
  }

  if (!imageFile || !imageFile.buffer || imageFile.size === 0) {
    return res.status(400).json({ error: "An image file is required." });
  }

  if (imageFile.size > MAX_IMAGE_BYTES) {
    return res.status(400).json({
      error: "Image size must be 4 MB or less.",
    });
  }

  if (!ALLOWED_TYPES.includes(imageFile.mimetype)) {
    return res.status(415).json({
      error: "Only JPG, PNG and WebP images are allowed.",
    });
  }

  const photoId = randomUUID();

  const ext =
    imageFile.mimetype === "image/png"
      ? "png"
      : imageFile.mimetype === "image/webp"
        ? "webp"
        : "jpg";

  const storageKey = `life-at-ism/${photoId}.${ext}`;

  try {
    await uploadLifeAtISMImage(
      storageKey,
      imageFile.buffer,
      imageFile.mimetype
    );
  } catch (error) {
    console.error(
      "Storage upload error:",
      error instanceof Error ? error.message : "Unknown"
    );

    return res.status(503).json({
      error: "Unable to upload image to storage.",
    });
  }

  try {
    await sql`
      INSERT INTO life_at_ism (
        id, title, caption, category,
        storage_key, content_type,
        is_legacy, is_published, sort_order
      ) VALUES (
        ${photoId},
        ${title.trim()},
        ${caption.trim()},
        ${category.trim()},
        ${storageKey},
        ${imageFile.mimetype},
        FALSE,
        TRUE,
        (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM life_at_ism)
      )
    `;
  } catch (error) {
    console.error(
      "DB insert error:",
      error instanceof Error ? error.message : "Unknown"
    );

    // Clean up the uploaded object if saving its database record fails.
    try {
      await deleteLifeAtISMImage(storageKey);
    } catch (cleanupError) {
      console.warn(
        "Uploaded image cleanup failed:",
        cleanupError instanceof Error ? cleanupError.message : "Unknown"
      );
    }

    return res.status(503).json({
      error: "Unable to save photo metadata.",
    });
  }

  return res.status(201).json({
    message: "Photo uploaded successfully.",
    photo: {
      id: photoId,
      title: title.trim(),
      caption: caption.trim(),
      category: category.trim(),
      image_url: `/api/life-at-ism/${photoId}/image`,
      is_legacy: false,
      is_published: true,
    },
  });
}
export async function updateLifeAtISMPhoto(req, res) {
  const { id, title, caption = "", category } = req.body ?? {};
  const imageFile = req.file;

  if (typeof id !== "string" || !UUID_RE.test(id.trim())) {
    return res.status(400).json({
      error: "A valid photo ID is required.",
    });
  }

  if (
    typeof title !== "string" ||
    !title.trim() ||
    title.trim().length > 150
  ) {
    return res.status(400).json({
      error: "Photo title is required (max 150 characters).",
    });
  }

  if (
    typeof category !== "string" ||
    !VALID_CATEGORIES.includes(category.trim())
  ) {
    return res.status(400).json({ error: "Invalid category." });
  }

  if (typeof caption !== "string") {
    return res.status(400).json({ error: "Invalid caption." });
  }

  const photoId = id.trim();

  let existing;

  try {
    const rows = await sql`
      SELECT id, is_legacy, storage_key, content_type
      FROM life_at_ism
      WHERE id = ${photoId}
      LIMIT 1
    `;

    existing = rows[0];
  } catch (error) {
    console.error(
      "DB fetch error:",
      error instanceof Error ? error.message : "Unknown"
    );

    return res.status(503).json({
      error: "Unable to fetch photo record.",
    });
  }

  if (!existing) {
    return res.status(404).json({ error: "Photo not found." });
  }

  let newStorageKey = null;
  let newContentType = null;

  if (imageFile && imageFile.size > 0) {
    if (imageFile.size > MAX_IMAGE_BYTES) {
      return res.status(400).json({
        error: "Image size must be 4 MB or less.",
      });
    }

    if (!ALLOWED_TYPES.includes(imageFile.mimetype)) {
      return res.status(415).json({
        error: "Only JPG, PNG and WebP images are allowed.",
      });
    }

    const ext =
      imageFile.mimetype === "image/png"
        ? "png"
        : imageFile.mimetype === "image/webp"
          ? "webp"
          : "jpg";

    newStorageKey = `life-at-ism/${photoId}.${ext}`;
    newContentType = imageFile.mimetype;

    try {
      await uploadLifeAtISMImage(
        newStorageKey,
        imageFile.buffer,
        imageFile.mimetype
      );
    } catch (error) {
      console.error(
        "Storage upload error:",
        error instanceof Error ? error.message : "Unknown"
      );

      return res.status(503).json({
        error: "Unable to upload replacement image.",
      });
    }
  }

  try {
    if (newStorageKey && newContentType) {
      await sql`
        UPDATE life_at_ism
        SET title = ${title.trim()},
            caption = ${caption.trim()},
            category = ${category.trim()},
            storage_key = ${newStorageKey},
            content_type = ${newContentType},
            updated_at = NOW()
        WHERE id = ${photoId}
      `;
    } else {
      await sql`
        UPDATE life_at_ism
        SET title = ${title.trim()},
            caption = ${caption.trim()},
            category = ${category.trim()},
            updated_at = NOW()
        WHERE id = ${photoId}
      `;
    }
  } catch (error) {
    console.error(
      "DB update error:",
      error instanceof Error ? error.message : "Unknown"
    );

    return res.status(503).json({
      error: "Unable to update photo record.",
    });
  }

  // Delete the old image only after the database update succeeds.
  // Never delete legacy images from the public folder.
  if (
    newStorageKey &&
    !existing.is_legacy &&
    existing.storage_key &&
    existing.storage_key !== newStorageKey
  ) {
    try {
      await deleteLifeAtISMImage(existing.storage_key);
    } catch (error) {
      console.warn(
        "Old storage object deletion failed:",
        error instanceof Error ? error.message : "Unknown"
      );
    }
  }

  return res.status(200).json({
    message: "Photo updated successfully.",
  });
}
export async function deleteLifeAtISMPhoto(req, res) {
  const { id } = req.body ?? {};
  const photoId = id ?? req.query.id;

  if (typeof photoId !== "string" || !UUID_RE.test(photoId)) {
    return res.status(400).json({
      error: "A valid photo ID is required.",
    });
  }

  let existing;

  try {
    const rows = await sql`
      SELECT id, is_legacy, storage_key
      FROM life_at_ism
      WHERE id = ${photoId}
      LIMIT 1
    `;

    existing = rows[0];
  } catch (error) {
    console.error(
      "DB fetch error:",
      error instanceof Error ? error.message : "Unknown"
    );

    return res.status(503).json({
      error: "Unable to fetch photo record.",
    });
  }

  if (!existing) {
    return res.status(404).json({ error: "Photo not found." });
  }

  try {
    await sql`
      DELETE FROM life_at_ism
      WHERE id = ${photoId}
    `;
  } catch (error) {
    console.error(
      "DB delete error:",
      error instanceof Error ? error.message : "Unknown"
    );

    return res.status(503).json({
      error: "Unable to delete photo record.",
    });
  }

  // Legacy images live in /public and must never be deleted here.
  if (!existing.is_legacy && existing.storage_key) {
    try {
      await deleteLifeAtISMImage(existing.storage_key);
    } catch (error) {
      console.warn(
        "Storage object deletion failed:",
        error instanceof Error ? error.message : "Unknown"
      );
    }
  }

  return res.status(200).json({
    message: "Photo deleted successfully.",
  });
}