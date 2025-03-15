'use client'
import { useSortable } from "@dnd-kit/sortable";
import { Box, SxProps } from "@mui/material";
import { memo } from "react";
import { TocSection } from "../model/toc.type";
import { StyledSectionNode } from "./styled-toc-node";



type Props = {
  section: TocSection;
  depth: number;
  sx?: SxProps
}
export const DndTocSection = memo(function SortableSection({
  section,
  depth,
  sx
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({ id: section.id });

  const style = transform ? {
    transform: `translate(${transform.x}, ${transform.y})`,
    transition,
  } : undefined;


  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      sx={{
        backgroundColor: isDragging ? 'skyblue' : isOver ? "red" : "inherit",
      }}
    >
      <StyledSectionNode
        section={section}
        depth={depth}
      />
    </Box>
  );
})