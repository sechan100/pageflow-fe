'use client'
import { TocFolder, useEditorTocStore } from '@/entities/book';
import { useNextRouter } from "@/shared/hooks/useNextRouter";
import { DragEndEvent, DragStartEvent, useDndMonitor } from "@dnd-kit/core";
import { Box, Collapse, List, SxProps, Tooltip } from "@mui/material";
import { ChevronDown, ChevronRight } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { useIndicator } from "../model/dnd/use-indicator";
import { useIsOver } from "../model/dnd/use-is-over";
import { useFolderOpen } from "../model/use-folder-open";
import { Dndable } from "./Dndable";
import { renderTocNode } from "./render-toc-node";
import { StyledBaseTocNode } from "./StyledBaseTocNode";


const folderEditPageLink = (bookId: string, folderId: string) => `/write/${bookId}/folders/${folderId}`;

type StyledFolderNodeProps = {
  folder: TocFolder;
  depth: number;
  isOpen: boolean;
  onClick?: (folder: TocFolder) => void;
  onIconClick?: (folder: TocFolder) => void;
  sx?: SxProps
}
export const StyledFolderNode = memo(function Folder({
  folder,
  depth,
  isOpen,
  onClick,
  onIconClick,
  sx
}: StyledFolderNodeProps) {
  const { params } = useNextRouter();
  const isEditing = useMemo(() => params?.folderId === folder.id, [params, folder.id]);

  return (
    <StyledBaseTocNode
      isActive={isEditing}
      depth={depth}
      onClick={() => onClick?.(folder)}
      onIconClick={() => onIconClick?.(folder)}
      icon={isOpen ? <ChevronDown /> : <ChevronRight />}
      text={folder.title}
    />
  )
})


type Props = {
  folder: TocFolder;
  depth: number;
}
export const DndTocFolder = memo(function DroppableFolder({
  folder,
  depth,
}: Props) {
  const { bookId } = useEditorTocStore(s => s.toc);
  const { isOpen, toggle, changeOpen } = useFolderOpen(folder.id);
  const { router } = useNextRouter();
  const isOver = useIsOver(folder.id);
  const { indicator } = useIndicator(folder.id);
  const isIntoFolderOperation = indicator?.mode === "box" && isOver;

  // drag 때문에 folder가 닫혀있는건지 여부(일시적으로 닫힌 경우)
  const isClosedForDragStart = useRef(false);

  // 해당 folder가 drag될 때, folder가 열려있다면 일시적으로 닫음
  const onDragStart = useCallback(({ active }: DragStartEvent) => {
    if (active.id === folder.id && isOpen) {
      toggle();
      isClosedForDragStart.current = true;
    }
  }, [folder.id, isOpen, toggle]);

  // 해당 folder가 drag end되면 folder를 다시 열음
  const onDragEnd = useCallback(({ active }: DragEndEvent) => {
    if (active.id === folder.id && isClosedForDragStart.current) {
      toggle();
      isClosedForDragStart.current = false;
    }
  }, [folder.id, toggle]);

  useDndMonitor({
    onDragStart,
    onDragEnd,
  });

  // 자식이 없으면 닫음
  useEffect(() => {
    if (folder.children.length === 0) {
      changeOpen(false);
    }
  }, [folder.children.length, changeOpen]);

  return (
    <Box>
      <Dndable
        node={folder}
        depth={depth}
      >
        <StyledFolderNode
          folder={folder}
          isOpen={isOpen}
          depth={depth}
          onClick={() => router.push(folderEditPageLink(bookId, folder.id))}
          onIconClick={() => toggle()}
        />
        <Tooltip
          title={`'${folder.title}'에 추가`}
          placement="right"
          open={isIntoFolderOperation}
        >
          <Box />
        </Tooltip>
      </Dndable >
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <List disablePadding>
          {folder.children.map(child => renderTocNode(child, depth + 1))}
        </List>
      </Collapse>
    </Box>
  );
})