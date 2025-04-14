import { EditorTocFolder, EditorTocNode, EditorTocNodeType, EditorTocSection } from "@/entities/editor";
import { Active, Collision, Over, Translate } from "@dnd-kit/core";



export type TocNodeDndData = {
  id: string;
  type: EditorTocNodeType;
  node: EditorTocNode;
  depth: number;
}

export type TocFolderDndData = TocNodeDndData & {
  type: "FOLDER";
  node: EditorTocFolder;
  isOpen: boolean;
}

export type TocSectionDndData = TocNodeDndData & {
  type: "SECTION";
  node: EditorTocSection;
}

export interface DragEvent {
  activatorEvent: Event;
  active: Active;
  collisions: Collision[] | null;
  delta: Translate;
  over: Over | null;
}

export const extractTocNodeDndData = (activeOrOver: Active | Over): TocNodeDndData => {
  const dataRef = activeOrOver.data;
  if (!dataRef.current) {
    throw new Error("Active 또는 Over에 dnd data가 없습니다.");
  }
  return dataRef.current as TocNodeDndData;
}