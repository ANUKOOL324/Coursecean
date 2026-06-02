import { loginUser } from "@/lib/authStore";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { username, password } = req.body;

  if (typeof username !== "string" || typeof password !== "string") {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const token = loginUser(username, password);

  if (!token) {
    return res.status(403).json({ message: "Invalid username or password" });
  }

  return res.status(200).json({ message: "Logged in successfully", token });
}
