import "./backend/config/env.js";

const email = process.env.ADMIN_EMAIL?.trim();
const hash = process.env.ADMIN_PASSWORD_HASH;
const secret = process.env.ADMIN_SESSION_SECRET;

console.log({
  emailConfigured: !!email,
  emailFormatValid: !!email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  hashConfigured: !!hash,
  hashFormatValid: !!hash && /^\$2[aby]\$(0[4-9]|[12]\d|3[01])\$[./A-Za-z0-9]{53}$/.test(hash),
  secretConfigured: !!secret,
  secretLengthValid: !!secret && Buffer.byteLength(secret, "utf8") >= 32
});
