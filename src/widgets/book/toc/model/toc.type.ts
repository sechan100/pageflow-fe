/**
 * 클라이언트에서 사용하는 Toc 타입들을 정의.
 * SvToc 타입들과는 다르다.
 */

export type TocNodeType = "folder" | "section";

export type TocNode = {
  id: string; // UUID
  title: string;
  type: TocNodeType;
}

export type TocFolder = TocNode & {
  type: "folder";
  children: TocNode[];
}

export type TocSection = TocNode & {
  type: "section";
}

export type Toc = {
  bookId: string; // UUID
  root: TocFolder;
}

export const NodeTypeGuard = {
  isTocNode: (obj: any): obj is TocNode => {
    return obj && typeof obj.id === "string" && typeof obj.title === "string" && (obj.type === "folder" || obj.type === "section");
  },
  isFolder(node: any): node is TocFolder {
    return this.isTocNode(node) && node.type === "folder";
  },
  isSection(node: any): node is TocSection {
    return this.isTocNode(node) && node.type === "section";
  }
}