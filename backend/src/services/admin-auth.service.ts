import { createHmac, timingSafeEqual } from "node:crypto";
import {
  ADMIN_AUTH_PROTECTED,
  ADMIN_AUTH_SECRET,
  ADMIN_CREDENTIAL_AUTH_ENABLED,
  ADMIN_PASSWORD,
  ADMIN_TOKEN_TTL_MINUTES,
  ADMIN_USERNAME
} from "../config";
import { AppError } from "../errors";

interface AdminTokenPayload {
  sub: string;
  exp: number;
}

function secureEquals(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }
  return timingSafeEqual(leftBuffer, rightBuffer);
}

function sign(payloadEncoded: string): string {
  return createHmac("sha256", ADMIN_AUTH_SECRET).update(payloadEncoded).digest("base64url");
}

function buildToken(payload: AdminTokenPayload): string {
  const payloadEncoded = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const signature = sign(payloadEncoded);
  return `${payloadEncoded}.${signature}`;
}

function decodePayload(payloadEncoded: string): AdminTokenPayload | null {
  try {
    const payloadText = Buffer.from(payloadEncoded, "base64url").toString("utf8");
    const payload = JSON.parse(payloadText) as Partial<AdminTokenPayload>;
    if (typeof payload.sub !== "string" || typeof payload.exp !== "number") {
      return null;
    }
    return { sub: payload.sub, exp: payload.exp };
  } catch {
    return null;
  }
}

export function isAdminAccessProtected(): boolean {
  return ADMIN_AUTH_PROTECTED;
}

export function loginAdminAccount(username: string, password: string): { accessToken: string; expiresInSeconds: number } {
  if (!ADMIN_CREDENTIAL_AUTH_ENABLED) {
    throw new AppError("BAD_REQUEST", "Admin account login is not configured", 400);
  }
  if (!secureEquals(username, ADMIN_USERNAME) || !secureEquals(password, ADMIN_PASSWORD)) {
    throw new AppError("UNAUTHORIZED", "Admin username or password is invalid", 401);
  }

  const expiresInSeconds = ADMIN_TOKEN_TTL_MINUTES * 60;
  const payload: AdminTokenPayload = {
    sub: ADMIN_USERNAME,
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds
  };

  return {
    accessToken: buildToken(payload),
    expiresInSeconds
  };
}

export function verifyAdminAccessToken(token: string): boolean {
  const [payloadEncoded, signature] = token.split(".");
  if (!payloadEncoded || !signature) {
    return false;
  }

  const expectedSignature = sign(payloadEncoded);
  if (!secureEquals(signature, expectedSignature)) {
    return false;
  }

  const payload = decodePayload(payloadEncoded);
  if (!payload) {
    return false;
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  return payload.sub === ADMIN_USERNAME && payload.exp > nowSeconds;
}
