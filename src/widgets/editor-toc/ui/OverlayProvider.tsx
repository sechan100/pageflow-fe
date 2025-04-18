'use client'
import { EditorTocFolder, EditorTocNode, EditorTocSection } from "@/entities/editor"
import { STYLES } from "@/global/styles"
import { DragEndEvent, DragOverlay, useDndMonitor } from "@dnd-kit/core"
import { Box, SxProps } from "@mui/material"
import { useCallback, useState } from "react"
import { indicatorZIndex } from "../config"
import { extractTocNodeDndData } from "../model/dnd/dnd-data"
import { StyledFolderNode } from "./DndTocFolder"
import { StyledSectionNode } from "./DndTocSection"

type OverlayProviderProps = {
  sx?: SxProps
}
export const OverlayProvider = ({
  sx
}: OverlayProviderProps) => {
  const [dragginNode, setDraggingNode] = useState<EditorTocNode | null>(null);

  const onDragMove = useCallback(({ active }: DragEndEvent) => {
    const data = extractTocNodeDndData(active);
    setDraggingNode(data.node);
  }, [])

  const onDragEnd = useCallback(() => {
    setDraggingNode(null);
  }, [])

  useDndMonitor({
    onDragMove,
    onDragEnd,
    onDragAbort(event) {

    },
  });

  return (
    <DragOverlay
      zIndex={indicatorZIndex - 1}
    >
      {dragginNode && (
        <Box
          sx={{
            backgroundColor: STYLES.color.background,
            opacity: 0.7,
            border: `1px solid ${STYLES.color.backgroundHsla({ s: -20, l: -20 })}`,
          }}
        >
          {dragginNode.type === "FOLDER"
            ? <StyledFolderNode folder={dragginNode as EditorTocFolder} isOpen={false} depth={0} />
            : <StyledSectionNode section={dragginNode as EditorTocSection} depth={0} />
          }
        </Box>
      )}
    </DragOverlay>
  )
}