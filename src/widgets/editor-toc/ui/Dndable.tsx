'use client'
import { EditorTocNode, isEditorTocFolder, isEditorTocSection } from '@/entities/editor';
import { STYLES } from "@/global/styles";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { Box, SxProps } from "@mui/material";
import { memo, useMemo } from "react";
import { TocFolderDndData, TocNodeDndData, TocSectionDndData } from "../model/dnd/dnd-data";
import { useIndicator } from "../model/dnd/use-indicator";
import { useFolderOpen } from "../model/use-folder-open";
import { Indicator } from "./Indicator";


const getDndData = (node: EditorTocNode, depth: number, isOpen: boolean | null): TocNodeDndData => {
  let data: TocNodeDndData;
  if (isEditorTocFolder(node)) {
    if (isOpen === null) throw new Error("isOpen이 null입니다.");
    const folderData: TocFolderDndData = {
      id: node.id,
      type: "FOLDER",
      node: node,
      depth,
      isOpen
    }
    data = folderData;
  } else if (isEditorTocSection(node)) {
    if (isOpen !== null) throw new Error("isOpen이 null이 아닙니다.");
    const sectionData: TocSectionDndData = {
      id: node.id,
      type: "SECTION",
      node: node,
      depth
    }
    data = sectionData;
  } else throw new Error("알 수 없는 노드 타입입니다.");
  return data;
}



type Props = {
  node: EditorTocNode;
  depth: number;
  children: React.ReactNode;
  sx?: SxProps
}
export const Dndable = memo(function Dndable({
  node,
  depth,
  children,
  sx
}: Props) {
  const { indicator } = useIndicator(node.id);
  const { getIsOpen } = useFolderOpen(node.id, isEditorTocSection(node));

  const data = useMemo<TocNodeDndData>(() => {
    if (isEditorTocFolder(node)) {
      return getDndData(node, depth, getIsOpen());

    } else if (isEditorTocSection(node)) {
      return getDndData(node, depth, null);

    } else throw new Error("알 수 없는 노드 타입입니다.");
  }, [depth, getIsOpen, node]);

  const {
    setNodeRef: droppable,
    isOver,
  } = useDroppable({
    id: node.id,
    data,
  });

  const {
    attributes,
    listeners,
    setNodeRef: draggable,
    isDragging,
  } = useDraggable({
    id: node.id,
    data,
  });

  return (
    <Box
      ref={droppable}
      sx={{
        position: "relative",
        touchAction: "none",
        backgroundColor: isDragging ? STYLES.color.backgroundHsla({ l: -20, a: 0.7 }) : undefined,
      }}
    >
      <Box
        ref={draggable}
        {...attributes}
        {...listeners}
      >
        {children}
      </Box>
      {isOver && <Indicator mode={indicator} />}
    </Box>
  )
});