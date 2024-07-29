import { create } from "zustand";

interface AppStoreState {
    state: boolean
    setAppState: (condition: boolean) => void;
}

export const appStore = create<AppStoreState>((set) => ({
    state: false,
    setAppState: (condition) => set({ state: condition }),
}));