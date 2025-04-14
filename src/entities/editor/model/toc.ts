
export type EditorTocNodeType = "FOLDER" | "SECTION";

export type EditorTocNode = {
  id: string; // UUID
  title: string;
  type: EditorTocNodeType;
}

export type EditorTocFolder = EditorTocNode & {
  type: "FOLDER";
  children: EditorTocNode[];
}

export type EditorTocSection = EditorTocNode & {
  type: "SECTION";
}

export type EditorToc = {
  root: EditorTocFolder;
}

const isEditorTocNode = (obj: any): obj is EditorTocNode => {
  return obj && typeof obj.id === "string" && typeof obj.title === "string" && (obj.type === "FOLDER" || obj.type === "SECTION");
}

const isEditorTocFolder = (node: any): node is EditorTocFolder => {
  return isEditorTocNode(node) && node.type === "FOLDER";
}

const isEditorTocSection = (node: any): node is EditorTocSection => {
  return isEditorTocNode(node) && node.type === "SECTION";
}

export {
  isEditorTocFolder, isEditorTocNode, isEditorTocSection
};
