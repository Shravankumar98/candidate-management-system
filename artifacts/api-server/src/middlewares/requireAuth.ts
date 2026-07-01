import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { verifyAuthToken } from "../lib/auth";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: "admin" | "recruiter";
    iat: number;
    exp: number;
  };
}

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({
      error: "NO_TOKEN",
      message: "Authentication token is missing.",
    });
    return;
  }

  const token = header.substring(7);

  try {
    const payload = verifyAuthToken(token);

    (req as AuthRequest).user = payload;

    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        error: "TOKEN_EXPIRED",
        message: "Your session has expired. Please sign in again.",
      });
      return;
    }

    if (err instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        error: "INVALID_TOKEN",
        message: "Invalid authentication token.",
      });
      return;
    }

    console.error("Authentication error:", err);

    res.status(500).json({
      error: "AUTH_ERROR",
      message: "Authentication failed.",
    });
  }
}
