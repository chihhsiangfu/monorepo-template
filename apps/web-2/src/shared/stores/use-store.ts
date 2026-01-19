import { create } from "zustand";

type Store = {
  a: string;
  setA: (a: string) => void;
};

export const useStore = create<Store>()((set, get) => ({
  a: "",
  setA: (a) => set({ a }),
}));
