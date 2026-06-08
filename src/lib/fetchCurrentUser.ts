import axios from "axios";

// Fetch the logged-in user's info from /api/admin/me.
// We reuse this after page load (InitUser) and right after login/signup
// so isAdmin is always up to date from the server.
export async function fetchCurrentUser(token: string) {
  const response = await axios.get(`/api/admin/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return {
    username: response.data.username as string,
    isAdmin: Boolean(response.data.isAdmin),
  };
}