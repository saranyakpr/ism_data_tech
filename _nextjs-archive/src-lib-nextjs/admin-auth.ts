import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

export const ADMIN_SESSION_COOKIE = "ism_admin_session";

export const ADMIN_SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;

const BCRYPT_HASH_PATTERN =
  /^\$2[aby]\$(0[4-9]|[12]\d|3[01])\$[./A-Za-z0-9]{53}$/;

type AdminSessionPayload = {
  issuedAt: number;
  expiresAt: number;
  authVersion: 2;
};

export function getAdminAuthConfig() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;

  if (
    !email ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !passwordHash ||
    !BCRYPT_HASH_PATTERN.test(passwordHash) ||
    !sessionSecret ||
    Buffer.byteLength(sessionSecret, "utf8") < 32
  ) {
    return null;
  }

  return { email, passwordHash, sessionSecret };
}

export function isSameOriginAdminRequest(request: NextRequest) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  const expectedProtocol =
    process.env.NODE_ENV === "production"
      ? "https:"
      : request.nextUrl.protocol;

  if (!origin || !host) {
    return false;
  }

  try {
    const originUrl = new URL(origin);
    return (
      originUrl.host.toLowerCase() === host.toLowerCase() &&
      originUrl.protocol === expectedProtocol &&
      originUrl.username === "" &&
      originUrl.password === ""
    );
  } catch {
    return false;
  }
}

export function createAdminSessionToken(sessionSecret: string) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const payload: AdminSessionPayload = {
    issuedAt,
    expiresAt: issuedAt + ADMIN_SESSION_MAX_AGE_SECONDS,
    authVersion: 2,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = sign(encodedPayload, sessionSecret);

  return `${encodedPayload}.${signature}`;
}

export function verifyAdminSessionToken(
  token: string | undefined,
  sessionSecret: string,
) {
  if (!token || token.length > 512) {
    return false;
  }

  const [encodedPayload, encodedSignature, ...extraParts] = token.split(".");
  if (!encodedPayload || !encodedSignature || extraParts.length > 0) {
    return false;
  }

  const expectedSignature = Buffer.from(sign(encodedPayload, sessionSecret), "base64url");
  const actualSignature = Buffer.from(encodedSignature, "base64url");
  if (
    actualSignature.length !== expectedSignature.length ||
    !timingSafeEqual(actualSignature, expectedSignature)
  ) {
    return false;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    ) as Partial<AdminSessionPayload>;
    const now = Math.floor(Date.now() / 1000);

    return (
      Number.isSafeInteger(payload.issuedAt) &&
      Number.isSafeInteger(payload.expiresAt) &&
      payload.authVersion === 2 &&
      payload.issuedAt! <= now &&
      payload.expiresAt! > now &&
      payload.expiresAt! - payload.issuedAt! === ADMIN_SESSION_MAX_AGE_SECONDS
    );
  } catch {
    return false;
  }
}

export function getAdminSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  };
}

function sign(value: string, sessionSecret: string) {
  return createHmac("sha256", sessionSecret).update(value).digest("base64url");
}
