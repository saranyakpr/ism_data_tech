import { isSameOriginAdminRequest } from "../config/admin-auth.js";

export function requireSameOrigin(req, res, next) {
  if (!isSameOriginAdminRequest(req)) {
    return res.status(403).json({
      error: "Invalid request origin.",
    });
  }

  next();
}