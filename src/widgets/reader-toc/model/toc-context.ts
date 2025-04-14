import { createDataContext } from "@/shared/context";
import { ZustandStore } from "@/shared/zustand/zustand-store";

export type TocNodeType = "FOLDER" | "SECTION";

export type TocNode = {
  id: string; // UUID
  title: string;
  type: TocNodeType;
}

export type TocFolder = TocNode & {
  type: "FOLDER";
  children: (TocFolder | TocSection)[];
}

export type TocSection = TocNode & {
  type: "SECTION";
}

export type Toc = {
  root: TocFolder;
}

const isTocNode = (obj: any): obj is TocNode => {
  return obj && typeof obj.id === "string" && typeof obj.title === "string" && (obj.type === "FOLDER" || obj.type === "SECTION");
}

const isTocFolder = (node: any): node is TocFolder => {
  return isTocNode(node) && node.type === "FOLDER";
}

const isTocSection = (node: any): node is TocSection => {
  return isTocNode(node) && node.type === "SECTION";
}

export type ReaderPosition = {
  tocNodeId: string;
  tocNodeType: TocNodeType;
  lexicalNodeKey: number | null;
}

export type ReaderTocStore = {
  toc: Toc;
  position: ReaderPosition;
  setPosition: (position: ReaderPosition) => void;
}
const [ReaderTocStoreContextProvider, useReaderTocStoreContext] = createDataContext<ZustandStore<ReaderTocStore>>();

const useReaderTocStore = () => {
  const store = useReaderTocStoreContext();
  if (!store) {
    throw new Error("useReaderTocStore must be used within a ReaderTocStoreProvider");
  }
  return store;
}

export {
  isTocFolder, isTocNode, isTocSection,
  ReaderTocStoreContextProvider,
  useReaderTocStore
};

