import { ReaderTocStore, ReadOnlyToc } from "@/entities/reader";
import { createStoreContext } from "@/shared/zustand/create-store-context";
import { getStartingPositionOfToc } from "./get-starting-position-of-toc";


export const [ReaderTocStoreContextProvider, useReaderTocStore] = createStoreContext<ReadOnlyToc, ReaderTocStore>((reacOnlyToc, set, get) => ({
  toc: reacOnlyToc,
  position: getStartingPositionOfToc(reacOnlyToc),
  setPosition: (position) => set({ position }),
}));