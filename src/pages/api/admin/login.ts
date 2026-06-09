import { loginUser } from "@/lib/authStore";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== "POST") {
    return response.status(405).json({ message: "Method not allowed" });
  }

  const { username, password } = request.body;
  if (!username || !password) {
    return response.status(400).json({ message: "Username and password are required" });
  }

  try {
    const token = await loginUser(username, password);

    if (!token) {
      return response.status(403).json({ message: "Invalid username or password" });
    }

    return response.status(200).json({ message: "Logged in successfully", token });
  } catch (error) {
    console.error("Login error:", error);
    return response.status(500).json({ message: "Internal server error" });
  }
}
