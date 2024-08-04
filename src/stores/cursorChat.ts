import { atom } from "recoil";

export const cursorState = atom<boolean>({
  key: "cursorState",
  default: false,
});
