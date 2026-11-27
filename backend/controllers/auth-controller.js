import { compare } from "bcryptjs";

import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  getAdminAuthConfig,
  getAdminSessionCookieOptions,
  isSameOriginAdminRequest,
} from "../config/admin-auth.js";

export async function adminLogin(req, res) {
  if (!isSameOriginAdminRequest(req)) {
    return res.status(403).json({
      error: "Invalid request origin.",
    });
  }

  if (!req.is("application/json")) {
    return res.status(415).json({
      error: "Expected a JSON request.",
    });
  }

  const body = req.body;

  if (
    typeof body !== "object" ||
    body === null ||
    typeof body.email !== "string" ||
    body.email.trim().length === 0 ||
    Buffer.byteLength(body.email, "utf8") > 254 ||
    typeof body.password !== "string" ||
    body.password.length === 0 ||
    Buffer.byteLength(body.password, "utf8") > 72
  ) {
    return res.status(400).json({
      error: "Invalid request.",
    });
  }

  const config = getAdminAuthConfig();

  if (!config) {
    console.error("Admin authentication is not configured correctly.");

    return res.status(503).json({
      error: "Admin authentication is unavailable.",
    });
  }

  let passwordMatches;

  try {
    passwordMatches = await compare(
      body.password,
      config.passwordHash
    );
  } catch {
    console.error("Admin password hash verification failed.");

    return res.status(503).json({
      error: "Admin authentication is unavailable.",
    });
  }

  if (
    body.email.trim().toLowerCase() !== config.email ||
    !passwordMatches
  ) {
    return res.status(401).json({
      error: "Invalid email or password.",
    });
  }

  res.set("Cache-Control", "no-store");

  res.cookie(
    ADMIN_SESSION_COOKIE,
    createAdminSessionToken(config.sessionSecret),
    getAdminSessionCookieOptions()
  );

  return res.status(200).json({
    success: true,
  });
}

export function adminLogout(req, res) {
  if (!isSameOriginAdminRequest(req)) {
    return res.status(403).json({
      error: "Invalid request origin.",
    });
  }

  res.set("Cache-Control", "no-store");

  res.clearCookie(ADMIN_SESSION_COOKIE, {
    ...getAdminSessionCookieOptions(),
    maxAge: undefined,
    expires: new Date(0),
  });

  return res.status(200).json({
    success: true,
  });
}