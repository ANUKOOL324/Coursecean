import { getPurchasedCourseIds } from "@/lib/purchaseStore";
import { getUsernameFromToken } from "@/lib/authStore";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== "GET") {
    return response.status(405).json({ message: "Method not allowed" });
  }

  const authorizationHeader = request.headers.authorization;
  const token = authorizationHeader?.startsWith("Bearer ") ? authorizationHeader.slice(7) : null;
  const username = getUsernameFromToken(token);

  if (!username) {
    return response.status(401).json({ message: "Invalid token" });
  }

  try {
    const courseIds = await getPurchasedCourseIds(username);
    return response.status(200).json({ courseIds });
  } catch (error) {
    console.error("GET purchases error:", error);
    return response.status(500).json({ message: "Internal server error" });
  }
}
