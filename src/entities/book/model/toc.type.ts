

export type TocNodeType = "FOLDER" | "SECTION";

export type TocNode = {
  id: string; // UUID
  title: string;
  type: TocNodeType;
}

export type TocFolder = TocNode & {
  type: "FOLDER";
  children: TocNode[];
}

export type TocSection = TocNode & {
  type: "SECTION";
}

export type Toc = {
  bookId: string; // UUID
  root: TocFolder;
}