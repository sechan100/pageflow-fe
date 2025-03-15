import { Active, Collision, Over, Translate } from "@dnd-kit/core";
import { TocFolder, TocNode, TocNodeType, TocSection } from "../toc.type";



export type TocNodeDndData = {
  id: string;
  type: TocNodeType;
  node: TocNode;
  depth: number;
}

export type TocFolderDndData = TocNodeDndData & {
  type: "folder";
  node: TocFolder;
  isOpen: boolean;
}

export type TocSectionDndData = TocNodeDndData & {
  type: "section";
  node: TocSection;
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
  if(!dataRef.current) {
    throw new Error("Active 또는 Over에 dnd data가 없습니다.");
  }
  return dataRef.current as TocNodeDndData;
}