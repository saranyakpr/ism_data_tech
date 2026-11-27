import { getAdminAuthConfig } from "./backend/config/admin-auth.js";

const config = getAdminAuthConfig();

console.log("Admin authentication config valid:", !!config);
