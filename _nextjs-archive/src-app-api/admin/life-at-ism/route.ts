import "server-only";

import { type NextRequest } from "next/server";
import { requireAdminApiSession, adminApiJson } from "@/lib/admin-api-auth";
import { isSameOriginAdminRequest } from "@/lib/admin-auth";
import { sql } from "@/lib/neon";
import {
  uploadLifeAtISMImage,
  deleteLifeAtISMImage,
} from "@/lib/storage";
import { randomUUID } from "node:crypto";

export const runtime = "nodejs";

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
type AllowedType = (typeof ALLOWED_TYPES)[number];
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const VALID_CATEGORIES = ["brainstorming", "cultural", "outing", "fun"] as const;

type LifeAtISMRow = {
  id: string;
  title: string;
  caption: string | null;
  category: string;
  image_path: string | null;
  storage_key: string | null;
  content_type: string | null;
  is_legacy: boolean;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

/* ── GET – list all photos ─────────────────────── */
export async function GET() {
  const authError = await requireAdminApiSession();
  if (authError) return authError;

  try {
    const rows = (await sql`
      SELECT id, title, caption, category,
             image_path, storage_key, content_type,
             is_legacy, is_published, sort_order,
             created_at, updated_at
      FROM life_at_ism
      ORDER BY sort_order ASC, created_at ASC
    `) as LifeAtISMRow[];

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

    return adminApiJson({ photos });
  } catch (error) {
    console.error(
      "Admin life-at-ism GET error:",
      error instanceof Error ? error.message : "Unknown",
    );
    return adminApiJson(
      { error: "Unable to load gallery photos." },
      { status: 503 },
    );
  }
}

/* ── POST – upload new photo ───────────────────── */
export async function POST(request: NextRequest) {
  const authError = await requireAdminApiSession();
  if (authError) return authError;

  if (!isSameOriginAdminRequest(request)) {
    return adminApiJson(
      { error: "Cross-origin requests are not allowed." },
      { status: 403 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return adminApiJson(
      { error: "Invalid multipart form data." },
      { status: 400 },
    );
  }

  const title = (formData.get("title") as string | null)?.trim();
  const caption = (formData.get("caption") as string | null)?.trim() ?? "";
  const category = (formData.get("category") as string | null)?.trim();
  const imageFile = formData.get("image") as File | null;

  if (!title || title.length > 150) {
    return adminApiJson(
      { error: "Photo title is required (max 150 characters)." },
      { status: 400 },
    );
  }
  if (!category || !VALID_CATEGORIES.includes(category as (typeof VALID_CATEGORIES)[number])) {
    return adminApiJson(
      { error: "Invalid category." },
      { status: 400 },
    );
  }
  if (!imageFile || imageFile.size === 0) {
    return adminApiJson({ error: "An image file is required." }, { status: 400 });
  }
  if (imageFile.size > MAX_IMAGE_BYTES) {
    return adminApiJson(
      { error: "Image size must be 4 MB or less." },
      { status: 400 },
    );
  }
  if (!ALLOWED_TYPES.includes(imageFile.type as AllowedType)) {
    return adminApiJson(
      { error: "Only JPG, PNG and WebP images are allowed." },
      { status: 415 },
    );
  }

  const buffer = Buffer.from(await imageFile.arrayBuffer());
  const photoId = randomUUID();
  const ext =
    imageFile.type === "image/png" ? "png" : imageFile.type === "image/webp" ? "webp" : "jpg";
  const storageKey = `life-at-ism/${photoId}.${ext}`;

  try {
    await uploadLifeAtISMImage(storageKey, buffer, imageFile.type);
  } catch (error) {
    console.error("Storage upload error:", error instanceof Error ? error.message : "Unknown");
    return adminApiJson({ error: "Unable to upload image to storage." }, { status: 503 });
  }

  try {
    await sql`
      INSERT INTO life_at_ism (
        id, title, caption, category,
        storage_key, content_type,
        is_legacy, is_published, sort_order
      ) VALUES (
        ${photoId}, ${title}, ${caption}, ${category},
        ${storageKey}, ${imageFile.type},
        FALSE, TRUE,
        (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM life_at_ism)
      )
    `;
  } catch (error) {
    console.error("DB insert error:", error instanceof Error ? error.message : "Unknown");
    return adminApiJson({ error: "Unable to save photo metadata." }, { status: 503 });
  }

  return adminApiJson(
    {
      message: "Photo uploaded successfully.",
      photo: {
        id: photoId,
        title,
        caption,
        category,
        image_url: `/api/life-at-ism/${photoId}/image`,
        is_legacy: false,
        is_published: true,
      },
    },
    { status: 201 },
  );
}

/* ── PATCH – edit photo (title / caption / category / replace image) ── */
export async function PATCH(request: NextRequest) {
  const authError = await requireAdminApiSession();
  if (authError) return authError;

  if (!isSameOriginAdminRequest(request)) {
    return adminApiJson({ error: "Cross-origin requests are not allowed." }, { status: 403 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return adminApiJson({ error: "Invalid multipart form data." }, { status: 400 });
  }

  const id = (formData.get("id") as string | null)?.trim();
  const title = (formData.get("title") as string | null)?.trim();
  const caption = (formData.get("caption") as string | null)?.trim() ?? "";
  const category = (formData.get("category") as string | null)?.trim();
  const imageFile = formData.get("image") as File | null;

  // Validate ID
  if (!id || !UUID_RE.test(id)) {
    return adminApiJson({ error: "A valid photo ID is required." }, { status: 400 });
  }
  if (!title || title.length > 150) {
    return adminApiJson(
      { error: "Photo title is required (max 150 characters)." },
      { status: 400 },
    );
  }
  if (!category || !VALID_CATEGORIES.includes(category as (typeof VALID_CATEGORIES)[number])) {
    return adminApiJson({ error: "Invalid category." }, { status: 400 });
  }

  // Load existing record
  type ExistingRow = {
    id: string;
    is_legacy: boolean;
    storage_key: string | null;
    content_type: string | null;
  };
  let existing: ExistingRow | undefined;
  try {
    const rows = (await sql`
      SELECT id, is_legacy, storage_key, content_type
      FROM life_at_ism
      WHERE id = ${id}
      LIMIT 1
    `) as ExistingRow[];
    existing = rows[0];
  } catch (error) {
    console.error("DB fetch error:", error instanceof Error ? error.message : "Unknown");
    return adminApiJson({ error: "Unable to fetch photo record." }, { status: 503 });
  }

  if (!existing) {
    return adminApiJson({ error: "Photo not found." }, { status: 404 });
  }

  // Handle optional image replacement
  let newStorageKey: string | null = null;
  let newContentType: string | null = null;

  if (imageFile && imageFile.size > 0) {
    if (imageFile.size > MAX_IMAGE_BYTES) {
      return adminApiJson({ error: "Image size must be 4 MB or less." }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(imageFile.type as AllowedType)) {
      return adminApiJson({ error: "Only JPG, PNG and WebP images are allowed." }, { status: 415 });
    }

    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const ext =
      imageFile.type === "image/png" ? "png" : imageFile.type === "image/webp" ? "webp" : "jpg";
    newStorageKey = `life-at-ism/${id}.${ext}`;
    newContentType = imageFile.type;

    // Upload new image first
    try {
      await uploadLifeAtISMImage(newStorageKey, buffer, imageFile.type);
    } catch (error) {
      console.error("Storage upload error:", error instanceof Error ? error.message : "Unknown");
      return adminApiJson({ error: "Unable to upload replacement image." }, { status: 503 });
    }
  }

  // Update DB record
  try {
    if (newStorageKey && newContentType) {
      await sql`
        UPDATE life_at_ism
        SET title        = ${title},
            caption      = ${caption},
            category     = ${category},
            storage_key  = ${newStorageKey},
            content_type = ${newContentType},
            updated_at   = NOW()
        WHERE id = ${id}
      `;
    } else {
      await sql`
        UPDATE life_at_ism
        SET title      = ${title},
            caption    = ${caption},
            category   = ${category},
            updated_at = NOW()
        WHERE id = ${id}
      `;
    }
  } catch (error) {
    console.error("DB update error:", error instanceof Error ? error.message : "Unknown");
    return adminApiJson({ error: "Unable to update photo record." }, { status: 503 });
  }

  // Delete old storage object ONLY after successful DB update
  // Never delete legacy files from /public
  if (
    newStorageKey &&
    !existing.is_legacy &&
    existing.storage_key &&
    existing.storage_key !== newStorageKey
  ) {
    try {
      await deleteLifeAtISMImage(existing.storage_key);
    } catch (error) {
      // Non-fatal — log but don't fail the request
      console.warn(
        "Old storage object deletion failed (non-fatal):",
        error instanceof Error ? error.message : "Unknown",
      );
    }
  }

  return adminApiJson({ message: "Photo updated successfully." });
}

/* ── DELETE – delete photo ─────────────────────── */
export async function DELETE(request: NextRequest) {
  const authError = await requireAdminApiSession();
  if (authError) return authError;

  if (!isSameOriginAdminRequest(request)) {
    return adminApiJson({ error: "Cross-origin requests are not allowed." }, { status: 403 });
  }

  // Accept ID from JSON body or query param
  let id: string | null = null;
  try {
    const contentType = request.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      const body = (await request.json()) as { id?: string };
      id = body.id?.trim() ?? null;
    } else {
      id = request.nextUrl.searchParams.get("id");
    }
  } catch {
    return adminApiJson({ error: "Invalid request body." }, { status: 400 });
  }

  if (!id || !UUID_RE.test(id)) {
    return adminApiJson({ error: "A valid photo ID is required." }, { status: 400 });
  }

  // Load existing record
  type ExistingRow = {
    id: string;
    is_legacy: boolean;
    storage_key: string | null;
  };
  let existing: ExistingRow | undefined;
  try {
    const rows = (await sql`
      SELECT id, is_legacy, storage_key
      FROM life_at_ism
      WHERE id = ${id}
      LIMIT 1
    `) as ExistingRow[];
    existing = rows[0];
  } catch (error) {
    console.error("DB fetch error:", error instanceof Error ? error.message : "Unknown");
    return adminApiJson({ error: "Unable to fetch photo record." }, { status: 503 });
  }

  if (!existing) {
    return adminApiJson({ error: "Photo not found." }, { status: 404 });
  }

  // Delete DB record first
  try {
    await sql`DELETE FROM life_at_ism WHERE id = ${id}`;
  } catch (error) {
    console.error("DB delete error:", error instanceof Error ? error.message : "Unknown");
    return adminApiJson({ error: "Unable to delete photo record." }, { status: 503 });
  }

  // Delete storage object ONLY for non-legacy photos
  // Legacy photos use /public/images/life/ — NEVER touch those files
  if (!existing.is_legacy && existing.storage_key) {
    try {
      await deleteLifeAtISMImage(existing.storage_key);
    } catch (error) {
      console.warn(
        "Storage object deletion failed (non-fatal):",
        error instanceof Error ? error.message : "Unknown",
      );
    }
  }

  return adminApiJson({ message: "Photo deleted successfully." });
}
