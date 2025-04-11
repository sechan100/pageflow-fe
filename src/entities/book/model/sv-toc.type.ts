
/**
 * 서버에서 받아온 Toc 데이터와 완벽히 동일한 타입들로, prefix인 Sv는 Server의 약자이다.
 */

export type SvTocNodeType = "FOLDER" | "SECTION";

export type SvTocNode = {
  id: string; // UUID
  title: string;
  type: SvTocNodeType;
}

export type SvTocFolder = SvTocNode & {
  type: "FOLDER";
  children: (SvTocFolder | SvTocSection)[];
}

export type SvTocSection = SvTocNode & {
  type: "SECTION";
}

export type SvToc = {
  bookId: string; // UUID
  root: SvTocFolder;
}

export const SvNodeTypeGuard = {
  isSvTocNode: (obj: any): obj is SvTocNode => {
    return obj && typeof obj.id === "string" && typeof obj.title === "string" && (obj.type === "FOLDER" || obj.type === "SECTION");
  },
  isSvFolder(node: any): node is SvTocFolder {
    return this.isSvTocNode(node) && node.type === "FOLDER";
  },
  isSvSection(node: any): node is SvTocSection {
    return this.isSvTocNode(node) && node.type === "SECTION";
  }
}