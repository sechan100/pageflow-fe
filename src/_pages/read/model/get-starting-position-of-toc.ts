import { ReaderPosition, ReadOnlyToc } from "@/entities/reader";


export const getStartingPositionOfToc = (toc: ReadOnlyToc): ReaderPosition => {
  const root = toc.root;
  const firstChild = root.children[0];

  if (!firstChild) {
    throw new Error("Toc에 child가 없습니다.");
  }

  return {
    tocNodeId: firstChild.id,
    tocNodeType: firstChild.type,
    lexicalNodeKey: 1,
  };
}