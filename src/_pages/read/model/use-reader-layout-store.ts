import { create } from "zustand";



export type LayoutStore = {
  width: string;
  height: string;
  fontSize: number;
  lineHeight: number;
  wordSpacing: string;
}

export const useLayoutStore = create<LayoutStore>((set) => ({
  width: "70vw",
  height: "80vh",
  fontSize: 16,
  lineHeight: 1.5,
  wordSpacing: "0.1em",
}));