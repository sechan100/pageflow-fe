
export type ReadOnlyTocNodeType = "FOLDER" | "SECTION";

export type ReadOnlyTocNode = {
  id: string; // UUID
  title: string;
  type: ReadOnlyTocNodeType;
}

export type ReadOnlyTocFolder = ReadOnlyTocNode & {
  type: "FOLDER";
  children: ReadOnlyTocNode[];
}

export type ReadOnlyTocSection = ReadOnlyTocNode & {
  type: "SECTION";
}

export type ReadOnlyToc = {
  root: ReadOnlyTocFolder;
}

const isReadOnlyTocNode = (obj: any): obj is ReadOnlyTocNode => {
  return obj && typeof obj.id === "string" && typeof obj.title === "string" && (obj.type === "FOLDER" || obj.type === "SECTION");
}

const isReadOnlyTocFolder = (node: any): node is ReadOnlyTocFolder => {
  return isReadOnlyTocNode(node) && node.type === "FOLDER";
}

const isReadOnlyTocSection = (node: any): node is ReadOnlyTocSection => {
  return isReadOnlyTocNode(node) && node.type === "SECTION";
}

export {
  isReadOnlyTocFolder, isReadOnlyTocNode, isReadOnlyTocSection
};
