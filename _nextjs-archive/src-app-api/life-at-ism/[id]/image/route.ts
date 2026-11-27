import "server-only";

import { NextResponse } from "next/server";
import { sql } from "@/lib/neon";
import { downloadLifeAtISMImage } from "@/lib/storage";

export const runtime = "nodejs";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

type LifeAtISMImageRow = {
  storage_key: string;
  content_type: string;
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        id,
      )
    ) {
      return NextResponse.json({ error: "Image not found." }, { status: 404 });
    }

    const rows = (await sql`
      SELECT storage_key, content_type
      FROM life_at_ism
      WHERE id = ${id}
        AND is_published = TRUE
        AND storage_key IS NOT NULL
      LIMIT 1
    `) as LifeAtISMImageRow[];

    const row = rows[0];

    if (!row?.storage_key) {
      return NextResponse.json({ error: "Image not found." }, { status: 404 });
    }

    if (!ALLOWED_TYPES.includes(row.content_type)) {
      return NextResponse.json(
        { error: "Invalid image type." },
        { status: 415 },
      );
    }

    const buffer = await downloadLifeAtISMImage(row.storage_key);

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": row.content_type,
        "Content-Length": String(buffer.length),
        "Cache-Control":
          "public, max-age=3600, stale-while-revalidate=86400",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error(
      "Life at ISM image load error:",
      error instanceof Error ? error.message : "Unknown",
    );
    return NextResponse.json(
      { error: "Unable to load image." },
      { status: 500 },
    );
  }
}
