import "./backend/config/env.js";

const hash = process.env.ADMIN_PASSWORD_HASH || "";

console.log({
  length: hash.length,
  prefix: hash.slice(0, 7),
  startsWithBcrypt: /^\$2[aby]\$/.test(hash),
  containsSpaces: /\s/.test(hash)
});
