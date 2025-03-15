'use client'
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { Box, Collapse, List, SxProps } from "@mui/material";
import { memo, useMemo } from "react";
import { dndConfig } from "../config/dnd-config";
import { TocFolder } from "../model/toc.type";
import { useToc } from "../model/use-toc";
import { renderTocNode } from "./render-toc-node";
import { StyledFolderNode } from "./styled-toc-node";



type Props = {
  folder: TocFolder;
  depth: number;
  sx?: SxProps
}
export const DndTocFolder = memo(function DndSortableContextProviderFolder({
  folder,
  depth,
  sx
}: Props) {
  const items = useMemo(() => folder.children.map(c => c.id), [folder.children]);
  console.debug('FolderNode', folder.title)


  return (
    <SortableContext
      items={items}
      strategy={dndConfig.sortableStrategy}
    >
      <SortableFolder folder={folder} depth={depth} />
    </SortableContext>
  );
})



type SortableFolderProps = {
  folder: TocFolder;
  depth: number;
  sx?: SxProps
}
const SortableFolder = ({
  folder,
  depth,
  sx
}: SortableFolderProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({ id: folder.id });
  const toggleFolder = useToc(s => s.toggleFolder);

  const style = transform ? {
    transform: `translate(${transform.x}, ${transform.y})`,
    transition,
  } : undefined;


  return (
    <Box>
      <Box
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        sx={{
          backgroundColor: isDragging ? 'skyblue' : isOver ? "red" : "inherit",
        }}
      >
        <StyledFolderNode
          folder={folder}
          depth={depth}
          onClick={({ id }) => toggleFolder(id)}
        />
      </Box>
      <Collapse in={folder.isOpen} timeout="auto" unmountOnExit>
        <List disablePadding>
          {folder.children.map(child => renderTocNode(child, depth + 1))}
        </List>
      </Collapse>
    </Box>
  )
}