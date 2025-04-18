import { ReadOnlyToc, ReadOnlyTocNodeType } from "./toc";


export type ReaderPosition = {
  tocNodeId: string;
  tocNodeType: ReadOnlyTocNodeType;
  lexicalNodeKey: number;
}

export type ReaderTocStore = {
  toc: ReadOnlyToc;
  position: ReaderPosition;
  setPosition: (position: ReaderPosition) => void;
}