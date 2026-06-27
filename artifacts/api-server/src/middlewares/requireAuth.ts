import type { Request, Response, NextFunction } from "express";
import { verifyAuthToken } from "../lib/auth";

interface RequestWithUser extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: "recruiter" | "admin";
    iat: number;
    exp: number;
  };
}

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const header = req.get("authorization");
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const token = header.slice(7);
  const payload = verifyAuthToken(token);
  if (!payload) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  (req as RequestWithUser).user = payload;
  next();
}
