import "server-only";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  getAdminAuthConfig,
  verifyAdminSessionToken,
} from "@/lib/admin-auth";

export async function requireAdminApiSession() {
  const config = getAdminAuthConfig();

  if (!config) {
    return NextResponse.json(
      { error: "Admin authentication is unavailable." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  const sessionToken = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;

  if (!verifyAdminSessionToken(sessionToken, config.sessionSecret)) {
    return NextResponse.json(
      { error: "Admin authentication is required." },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  return null;
}

export function adminApiJson(
  body: unknown,
  init?: ResponseInit,
) {
  const headers = new Headers(init?.headers);
  headers.set("Cache-Control", "no-store");

  return NextResponse.json(body, { ...init, headers });
}