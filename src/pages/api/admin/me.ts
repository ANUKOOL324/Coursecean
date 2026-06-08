import { getUsernameFromToken, isAdminUser } from "@/lib/authStore";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const username = getUsernameFromToken(token);

  if (!username) {
    return res.status(401).json({ message: "Invalid token" });
  }

  // Tell the frontend whether this user is an admin.
  // The list of admin usernames comes from ADMIN_USERNAMES in .env.local.
  return res.status(200).json({
    username,
    isAdmin: isAdminUser(username),
  });
}
