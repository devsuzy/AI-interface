import { atom } from "recoil";

export const cursorChatVisibleState = atom<boolean>({
  key: "cursorChatVisible",
  default: false,
});

export const cursorChatValueState = atom<string>({
  key: "cursorChatValue",
  default: "",
});
