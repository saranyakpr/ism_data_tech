import { compare } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  getAdminAuthConfig,
  getAdminSessionCookieOptions,
  isSameOriginAdminRequest,
} from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!isSameOriginAdminRequest(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ error: "Expected a JSON request." }, { status: 415 });
  }

  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > 1024) {
    return NextResponse.json({ error: "Request is too large." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("email" in body) ||
    typeof body.email !== "string" ||
    body.email.trim().length === 0 ||
    Buffer.byteLength(body.email, "utf8") > 254 ||
    !("password" in body) ||
    typeof body.password !== "string" ||
    body.password.length === 0 ||
    Buffer.byteLength(body.password, "utf8") > 72
  ) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const config = getAdminAuthConfig();
  if (!config) {
    console.error("Admin authentication is not configured correctly.");
    return NextResponse.json(
      { error: "Admin authentication is unavailable." },
      { status: 503 },
    );
  }

  let passwordMatches: boolean;
  try {
    passwordMatches = await compare(body.password, config.passwordHash);
  } catch {
    console.error("Admin password hash verification failed.");
    return NextResponse.json(
      { error: "Admin authentication is unavailable." },
      { status: 503 },
    );
  }

  if (
    body.email.trim().toLowerCase() !== config.email ||
    !passwordMatches
  ) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const response = NextResponse.json(
    { success: true },
    { headers: { "Cache-Control": "no-store" } },
  );
  response.cookies.set(
    ADMIN_SESSION_COOKIE,
    createAdminSessionToken(config.sessionSecret),
    getAdminSessionCookieOptions(),
  );
  return response;
}
