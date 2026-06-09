import { createUser } from "@/lib/authStore";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== "POST") {
    return response.status(405).json({ message: "Method not allowed" });
  }

  const { username, password } = request.body;

  if (typeof username !== "string" || typeof password !== "string") {
    return response.status(400).json({ message: "Username and password are required" });
  }

  try {
    const token = await createUser(username, password);

    if (!token) {
      return response.status(409).json({ message: "User already exists" });
    }

    return response.status(200).json({ message: "User created successfully", token });
  } catch (error) {
    console.error("Signup error:", error);
    return response.status(500).json({ message: "Internal server error" });
  }
}
