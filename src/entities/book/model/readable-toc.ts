
export type ReadableTocNodeType = "FOLDER" | "SECTION";

export type ReadableTocNode = {
  id: string; // UUID
  title: string;
  type: ReadableTocNodeType;
}

export type ReadableTocFolder = ReadableTocNode & {
  type: "FOLDER";
  children: ReadableTocNode[];
}

export type ReadableTocSection = ReadableTocNode & {
  type: "SECTION";
}

export type ReadableToc = {
  root: ReadableTocFolder;
}

const isReadableTocNode = (obj: any): obj is ReadableTocNode => {
  return obj && typeof obj.id === "string" && typeof obj.title === "string" && (obj.type === "FOLDER" || obj.type === "SECTION");
}

const isReadableTocFolder = (node: any): node is ReadableTocFolder => {
  return isReadableTocNode(node) && node.type === "FOLDER";
}

const isReadableTocSection = (node: any): node is ReadableTocSection => {
  return isReadableTocNode(node) && node.type === "SECTION";
}

export { isReadableTocFolder, isReadableTocNode, isReadableTocSection };


