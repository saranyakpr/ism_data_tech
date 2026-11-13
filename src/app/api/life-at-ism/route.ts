import "server-only";

import { NextResponse } from "next/server";
import { sql } from "@/lib/neon";

export const runtime = "nodejs";

type LifeAtISMRow = {
  id: string;
  title: string;
  caption: string | null;
  category: string;
  image_path: string | null;
  storage_key: string | null;
  is_legacy: boolean;
  is_published: boolean;
  sort_order: number;
};

export async function GET() {
  try {
    const rows = (await sql`
      SELECT id, title, caption, category, image_path,
             storage_key, is_legacy, is_published, sort_order
      FROM life_at_ism
      WHERE is_published = TRUE
      ORDER BY sort_order ASC, created_at ASC
    `) as LifeAtISMRow[];

    const photos = rows.map((row) => ({
      id: row.id,
      title: row.title,
      caption: row.caption ?? "",
      category: row.category,
      is_legacy: row.is_legacy,
      is_published: row.is_published,
      sort_order: row.sort_order,
      // Legacy images use static path; uploaded images use the API route
      image_url: row.is_legacy
        ? row.image_path ?? ""
        : `/api/life-at-ism/${row.id}/image`,
    }));

    return NextResponse.json({ photos });
  } catch (error) {
    console.error(
      "Life at ISM public route error:",
      error instanceof Error ? error.message : "Unknown",
    );
    return NextResponse.json(
      { error: "Unable to load gallery." },
      { status: 500 },
    );
  }
}
