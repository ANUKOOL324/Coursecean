import {atom} from "recoil";

export const userState = atom<{
    isLoading: boolean;
    userEmail: string | null;
    // True only if the server says this user is in ADMIN_USERNAMES (.env.local).
    isAdmin: boolean;
}>({
  key: 'userState',
  default: {
    isLoading: true,
    userEmail: null,
    isAdmin: false,
  },
});