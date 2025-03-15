'use client'
import { STYLES } from "@/global/styles"
import { DragEndEvent, DragOverlay, useDndMonitor } from "@dnd-kit/core"
import { Box, SxProps } from "@mui/material"
import { useCallback, useState } from "react"
import { indicatorZIndex } from "../config"
import { extractTocNodeDndData } from "../model/dnd/dnd-data"
import { TocFolder, TocNode, TocSection } from "../model/toc.type"
import { StyledFolderNode, StyledSectionNode } from "./styled-toc-node"

type OverlayProviderProps = {
  sx?: SxProps
}
export const OverlayProvider = ({
  sx
}: OverlayProviderProps) => {
  const [dragginNode, setDraggingNode] = useState<TocNode | null>(null);

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
          {dragginNode.type === "folder"
            ? <StyledFolderNode folder={dragginNode as TocFolder} isOpen={false} depth={0} />
            : <StyledSectionNode section={dragginNode as TocSection} depth={0} />
          }
        </Box>
      )}
    </DragOverlay>
  )
}