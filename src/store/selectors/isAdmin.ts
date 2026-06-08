import { userState } from "../atoms/user";
import { selector } from "recoil";

// Simple selector so components can read isAdmin without touching the full userState.
export const isAdminState = selector({
  key: "isAdminState",
  get: ({ get }) => {
    const state = get(userState);
    return state.isAdmin;
  },
});