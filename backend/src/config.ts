const DEFAULT_SHOP_OPEN_HOUR = 9;
const DEFAULT_SHOP_CLOSE_HOUR = 18;
const DEFAULT_MAX_CONCURRENT_APPOINTMENTS = 4;
const DEFAULT_ALLOWED_ORIGINS = ["http://localhost:3000", "http://localhost:3001"];
const DEFAULT_ADMIN_TOKEN_TTL_MINUTES = 720;

function parseEnvHour(name: string, fallback: number, min: number, max: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw.trim() === "") {
    return fallback;
  }

  const value = Number(raw);
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new Error(`${name} must be an integer between ${min} and ${max}`);
  }

  return value;
}

function parseEnvInt(name: string, fallback: number, min: number, max: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw.trim() === "") {
    return fallback;
  }

  const value = Number(raw);
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new Error(`${name} must be an integer between ${min} and ${max}`);
  }
  return value;
}

export const SHOP_OPEN_HOUR = parseEnvHour("SHOP_OPEN_HOUR", DEFAULT_SHOP_OPEN_HOUR, 0, 23);
export const SHOP_CLOSE_HOUR = parseEnvHour("SHOP_CLOSE_HOUR", DEFAULT_SHOP_CLOSE_HOUR, 1, 24);
export const MAX_CONCURRENT_APPOINTMENTS = parseEnvInt(
  "MAX_CONCURRENT_APPOINTMENTS",
  DEFAULT_MAX_CONCURRENT_APPOINTMENTS,
  1,
  20
);
export const ADMIN_API_KEY = process.env.ADMIN_API_KEY?.trim() || "";
export const ADMIN_USERNAME = process.env.ADMIN_USERNAME?.trim() || "";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";
export const ADMIN_CREDENTIAL_AUTH_ENABLED = ADMIN_USERNAME.length > 0 || ADMIN_PASSWORD.length > 0;
export const ADMIN_TOKEN_TTL_MINUTES = parseEnvInt(
  "ADMIN_TOKEN_TTL_MINUTES",
  DEFAULT_ADMIN_TOKEN_TTL_MINUTES,
  5,
  7 * 24 * 60
);
export const ADMIN_AUTH_SECRET =
  process.env.ADMIN_AUTH_SECRET?.trim() || `${ADMIN_USERNAME}:${ADMIN_PASSWORD}:cuthair-admin-auth`;
export const ADMIN_AUTH_PROTECTED = Boolean(ADMIN_API_KEY) || ADMIN_CREDENTIAL_AUTH_ENABLED;
export const ALLOWED_ORIGINS = (() => {
  const raw = process.env.ALLOWED_ORIGINS;
  if (!raw || raw.trim() === "") {
    return DEFAULT_ALLOWED_ORIGINS;
  }
  const values = raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  return values.length > 0 ? values : DEFAULT_ALLOWED_ORIGINS;
})();

if (SHOP_OPEN_HOUR >= SHOP_CLOSE_HOUR) {
  throw new Error("SHOP_OPEN_HOUR must be less than SHOP_CLOSE_HOUR");
}

if ((ADMIN_USERNAME.length > 0 && ADMIN_PASSWORD.length === 0) || (ADMIN_USERNAME.length === 0 && ADMIN_PASSWORD.length > 0)) {
  throw new Error("ADMIN_USERNAME and ADMIN_PASSWORD must be configured together");
}
