import crypto from "crypto";

type User = {
  username: string;
  password: string;
};

type AuthStore = {
  users: User[];
  sessions: Record<string, string>;
};

declare global {
  // Keeps the learning-project auth store alive during dev-server HMR.
  var courseceanAuthStore: AuthStore | undefined;
}

const authStore: AuthStore = globalThis.courseceanAuthStore ?? {
  users: [],
  sessions: {},
};

globalThis.courseceanAuthStore = authStore;

export function createUser(username: string, password: string) {
  const existingUser = authStore.users.find((user) => user.username === username);

  if (existingUser) {
    return null;
  }

  authStore.users.push({ username, password });
  return createSession(username);
}

export function loginUser(username: string, password: string) {
  const user = authStore.users.find(
    (storedUser) => storedUser.username === username && storedUser.password === password
  );

  if (!user) {
    return null;
  }

  return createSession(username);
}

export function getUsernameFromToken(token: string | null) {
  if (!token) {
    return null;
  }

  return authStore.sessions[token] ?? null;
}

function createSession(username: string) {
  const token = crypto.randomBytes(24).toString("hex");
  authStore.sessions[token] = username;
  return token;
}
