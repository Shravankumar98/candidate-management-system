import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "recruiter";
};

export type AuthPayload = AuthUser & {
  iat: number;
  exp: number;
};

const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function registerUser(input: {
  email: string;
  password: string;
  name: string;
  role?: "admin" | "recruiter";
}): Promise<AuthUser> {
  const email = input.email.toLowerCase();

  const existing = await User.findOne({ email });

  if (existing) {
    throw new Error("Email already registered");
  }

  const passwordHash = await hashPassword(input.password);

  const user = await User.create({
    email,
    passwordHash,
    name: input.name.trim(),
    role: input.role ?? "recruiter",
  });

  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

export async function authenticateUser(
  email: string,
  password: string,
): Promise<AuthUser | null> {
  const user = await User.findOne({
    email: email.toLowerCase(),
  });

  if (!user) {
    return null;
  }

  const valid = await verifyPassword(password, user.passwordHash);

  if (!valid) {
    return null;
  }

  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

export function createAuthToken(
  payload: Omit<AuthPayload, "iat" | "exp">,
): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1d",
  });
}

export function verifyAuthToken(token: string): AuthPayload {
  return jwt.verify(token, JWT_SECRET) as AuthPayload;
}

export async function getUserById(id: string): Promise<AuthUser | null> {
  const user = await User.findById(id);

  if (!user) return null;

  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
  };
}
