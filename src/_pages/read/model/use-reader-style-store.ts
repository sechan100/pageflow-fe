import { create } from "zustand";



export type ReaderStyle = {
  viewportWidth: number; // 단위: vw
  viewportHeight: number; // 단위: vh
  fontSize: number;
  lineHeight: number;
  wordSpacing: string;
}

export const DEFAULT_READER_STYLE: ReaderStyle = {
  viewportWidth: 65,
  viewportHeight: 75,
  fontSize: 17,
  lineHeight: 1.6,
  wordSpacing: "0.1em",
}

export const useReaderStyleStore = create<ReaderStyle>(() => DEFAULT_READER_STYLE);