import {
  ADMIN_SESSION_COOKIE,
  getAdminAuthConfig,
  verifyAdminSessionToken,
} from "../config/admin-auth.js";

export function requireAdmin(req, res, next) {
  const config = getAdminAuthConfig();

  if (!config) {
    return res.status(503).json({
      error: "Admin authentication is unavailable.",
    });
  }

  res.set("Cache-Control", "no-store");

  const sessionToken = req.cookies?.[ADMIN_SESSION_COOKIE];

  if (!verifyAdminSessionToken(sessionToken, config.sessionSecret)) {
    return res.status(401).json({
      error: "Admin authentication is required.",
    });
  }

  next();
}