import { getUsernameFromToken, isAdminUser } from "@/lib/authStore";
import type { NextApiRequest, NextApiResponse } from "next";

// Read the Bearer token from the request header.
// This is the same pattern used across our API routes.
export function getTokenFromRequest(req: NextApiRequest): string | null {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.slice(7);
}

// Make sure the user is logged in. Returns username, or null (and sends 401).
export function requireAuth(req: NextApiRequest, res: NextApiResponse): string | null {
  const token = getTokenFromRequest(req);
  const username = getUsernameFromToken(token);

  if (!username) {
    res.status(401).json({ message: "You must be logged in to do this." });
    return null;
  }

  return username;
}

// Make sure the user is logged in AND is an admin. Returns username, or null (and sends 401/403).
export function requireAdmin(req: NextApiRequest, res: NextApiResponse): string | null {
  const username = requireAuth(req, res);

  if (!username) {
    return null;
  }

  if (!isAdminUser(username)) {
    res.status(403).json({ message: "Only admins can perform this action." });
    return null;
  }

  return username;
}