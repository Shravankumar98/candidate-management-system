import crypto from "node:crypto";
import bcrypt from "bcryptjs";

interface RequestWithUser extends Request {
  user?: AuthPayload;
}

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: "recruiter" | "admin";
};

export type AuthPayload = AuthUser & {
  iat: number;
  exp: number;
};

type StoredUser = AuthUser & {
  passwordHash: string;
};

const users = new Map<string, StoredUser>();
const JWT_SECRET = process.env.JWT_SECRET ?? "dev-jwt-secret-change-me";

function base64UrlEncode(value: string | Buffer): string {
  return Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlDecode(value: string): string {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad = normalized.length % 4;
  const padded = pad === 0 ? normalized : normalized + "=".repeat(4 - pad);
  return Buffer.from(padded, "base64").toString("utf8");
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function createAuthToken(
  payload: Omit<AuthPayload, "iat" | "exp">,
  expiresIn = "1h",
): string {
  const now = Math.floor(Date.now() / 1000);
  const expiresAt = expiresIn === "1h" ? now + 60 * 60 : now + 60 * 60 * 24;
  const body = {
    ...payload,
    iat: now,
    exp: expiresAt,
  };
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedBody = base64UrlEncode(JSON.stringify(body));
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${encodedHeader}.${encodedBody}`)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

  return `${encodedHeader}.${encodedBody}.${signature}`;
}

export function verifyAuthToken(token: string): AuthPayload | null {
  const parts = token.split(".");
  if (parts.length !== 3) {
    return null;
  }

  const [header, payload, signature] = parts;
  const expectedSignature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

  if (expectedSignature !== signature) {
    return null;
  }

  try {
    const decoded = JSON.parse(base64UrlDecode(payload)) as AuthPayload;
    if (decoded.exp * 1000 <= Date.now()) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

export async function registerUser(input: {
  email: string;
  password: string;
  name: string;
  role?: "recruiter" | "admin";
}): Promise<AuthUser> {
  const normalizedEmail = input.email.toLowerCase();
  if (users.has(normalizedEmail)) {
    throw new Error("Email already registered");
  }

  const passwordHash = await hashPassword(input.password);
  const user: StoredUser = {
    id: crypto.randomUUID(),
    email: normalizedEmail,
    name: input.name.trim(),
    role: input.role ?? "recruiter",
    passwordHash,
  };

  users.set(normalizedEmail, user);
  return sanitizeUser(user);
}

export async function authenticateUser(
  email: string,
  password: string,
): Promise<AuthUser | null> {
  const normalizedEmail = email.toLowerCase();
  const user = users.get(normalizedEmail);
  if (!user) {
    return null;
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    return null;
  }

  return sanitizeUser(user);
}

export function getUserById(userId: string): AuthUser | null {
  for (const user of users.values()) {
    if (user.id === userId) {
      return sanitizeUser(user);
    }
  }

  return null;
}

function sanitizeUser(user: StoredUser): AuthUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}
