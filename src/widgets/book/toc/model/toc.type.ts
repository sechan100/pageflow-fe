

export type TocNodeType = "FOLDER" | "SECTION";

export type TocNode = {
  id: string; // UUID
  title: string;
  type: TocNodeType;
}

export type TocFolder = TocNode & {
  type: "FOLDER";
  isOpen: boolean;
  children: TocNode[];
}

export type TocSection = TocNode & {
  type: "SECTION";
}

export type Toc = {
  bookId: string; // UUID
  root: TocFolder;
}

export const NodeTypeGuard = {
  isTocNode: (obj: any): obj is TocNode => {
    return obj && typeof obj.id === "string" && typeof obj.title === "string" && (obj.type === "FOLDER" || obj.type === "SECTION");
  },
  isFolder(node: any): node is TocFolder {
    return this.isTocNode(node) && node.type === "FOLDER";
  },
  isSection(node: any): node is TocSection {
    return this.isTocNode(node) && node.type === "SECTION";
  }
}