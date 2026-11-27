import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  getAdminSessionCookieOptions,
  isSameOriginAdminRequest,
} from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  if (!isSameOriginAdminRequest(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  const response = NextResponse.json(
    { success: true },
    { headers: { "Cache-Control": "no-store" } },
  );
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    ...getAdminSessionCookieOptions(),
    expires: new Date(0),
    maxAge: 0,
  });
  return response;
}
