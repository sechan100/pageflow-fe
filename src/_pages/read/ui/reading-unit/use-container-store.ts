import { create } from "zustand";


export type ScrollContainerSize = {
  width: number;
  height: number;
  scrollWidth: number;
  scrollLeft: number;
}

type LeadNodeInfo = {
  id: string;
  readFrom: "start" | "end";
}

const fallbackContainerSize: ScrollContainerSize = {
  width: 0,
  height: 0,
  scrollWidth: 0,
  scrollLeft: 0,
}

type ContentDomStore = {
  leadNodeInfo: LeadNodeInfo;
  containerSize: ScrollContainerSize;
  changeLeadNode: (info: LeadNodeInfo) => void;
  setContainerSize: (containerSize: ScrollContainerSize) => void;
}

export const useContainerStore = create<ContentDomStore>((set) => ({
  leadNodeInfo: {
    id: "",
    readFrom: "start",
  },
  containerSize: fallbackContainerSize,
  changeLeadNode: (info: LeadNodeInfo) => {
    set({
      leadNodeInfo: info,
      containerSize: fallbackContainerSize,
    });
  },
  setContainerSize: (containerSize: ScrollContainerSize) => {
    set({ containerSize });
  }
}))