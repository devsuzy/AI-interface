import { atom } from "recoil";

export const isCanvasLoadingState = atom<boolean>({
  key: "isCanvasLoadingState",
  default: false,
});
