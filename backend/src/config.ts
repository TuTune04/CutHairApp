const DEFAULT_SHOP_OPEN_HOUR = 9;
const DEFAULT_SHOP_CLOSE_HOUR = 18;

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

export const SHOP_OPEN_HOUR = parseEnvHour("SHOP_OPEN_HOUR", DEFAULT_SHOP_OPEN_HOUR, 0, 23);
export const SHOP_CLOSE_HOUR = parseEnvHour("SHOP_CLOSE_HOUR", DEFAULT_SHOP_CLOSE_HOUR, 1, 24);

if (SHOP_OPEN_HOUR >= SHOP_CLOSE_HOUR) {
  throw new Error("SHOP_OPEN_HOUR must be less than SHOP_CLOSE_HOUR");
}
