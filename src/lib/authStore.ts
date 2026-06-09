import crypto from "crypto";
import bcryptjs from "bcryptjs";
import { connectToDatabase } from "./db";
import { User } from "./models";

type AuthStore = {
  sessions: Record<string, string>;
};

declare global {
  var courseceanAuthStore: AuthStore | undefined;
}

const authStore: AuthStore = globalThis.courseceanAuthStore ?? {
  sessions: {},
};

globalThis.courseceanAuthStore = authStore;

export async function createUser(username: string, password: string): Promise<string | null> {
  await connectToDatabase();

  const lowercaseUsername = username.toLowerCase();
  const existingUser = await User.findOne({ email: lowercaseUsername });

  if (existingUser) {
    return null;
  }

  const saltRounds = 10;
  const hashedPassword = await bcryptjs.hash(password, saltRounds);
  
  const newUser = new User({
    email: lowercaseUsername,
    password: hashedPassword,
    role: isAdminUser(lowercaseUsername) ? "ADMIN" : "STUDENT",
    profile: {
      firstName: "",
      lastName: "",
      avatar: "",
      bio: ""
    },
    metadata: {}
  });

  await newUser.save();

  return createSession(lowercaseUsername);
}

export async function loginUser(username: string, password: string): Promise<string | null> {
  await connectToDatabase();

  const lowercaseUsername = username.toLowerCase();
  const user = await User.findOne({ email: lowercaseUsername });

  if (!user) {
    return null;
  }

  const isPasswordCorrect = await bcryptjs.compare(password, user.password);
  if (!isPasswordCorrect) {
    return null;
  }

  return createSession(lowercaseUsername);
}

export function getUsernameFromToken(token: string | null): string | null {
  if (!token) {
    return null;
  }

  return authStore.sessions[token] ?? null;
}

export function isAdminUser(username: string): boolean {
  const rawList = process.env.ADMIN_USERNAMES ?? "";
  const adminUsernames = rawList
    .split(",")
    .map((name) => name.trim())
    .filter((name) => name.length > 0)
    .map((name) => name.toLowerCase());

  return adminUsernames.includes(username.toLowerCase());
}

function createSession(username: string): string {
  const token = crypto.randomBytes(24).toString("hex");
  authStore.sessions[token] = username.toLowerCase();
  return token;
}
