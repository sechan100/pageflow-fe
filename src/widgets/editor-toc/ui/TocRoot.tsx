'use client'
import { useTocStore } from '@/entities/book'
import { useNotification } from "@/shared/ui/notification"
import { closestCenter, DndContext, DragEndEvent, DragMoveEvent, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core"
import { List, SxProps } from "@mui/material"
import { useCallback } from "react"
import { relocateNodeApi } from "../api/relocate-node"
import { dndConfig } from "../config"
import { extractTocNodeDndData } from "../model/dnd/dnd-data"
import { DndOperationDispatcher } from "../model/dnd/dnd-operation"
import { useIndicatorStore } from "../model/dnd/use-indicator"
import { OverlayProvider } from "./OverlayProvider"
import { renderTocNode } from "./render-toc-node"



type Props = {
  sx?: SxProps
}
export const TocRoot = ({
  sx
}: Props) => {
  const toc = useTocStore(s => s.toc);
  const setToc = useTocStore(s => s.setToc);
  const notification = useNotification();
  const setIndicator = useIndicatorStore(s => s.setIndicator);
  const clearIndicator = useIndicatorStore(s => s.clearIndicator);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
        delay: dndConfig.pointerSensorDelay,
        tolerance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: dndConfig.touchSensorDelay,
        tolerance: 5,
      },
    })
  );

  // [[ Dnd 처리

  const handleDragMove = useCallback(({ over, active }: DragMoveEvent) => {
    if (!over) return null;
    const { depth: overDepth } = extractTocNodeDndData(over);
    const context = { active, over, toc, overDepth };
    const operation = DndOperationDispatcher.dispatch(context);
    if (operation) {
      setIndicator(String(over.id), operation.getIndicatorMode(context));
    } else {
      clearIndicator();
    }
  }, [clearIndicator, setIndicator, toc])

  const handleDragEnd = useCallback(({ over, active }: DragEndEvent) => {
    if (!over) return null;
    const { depth: overDepth } = extractTocNodeDndData(over);
    const context = { active, over, toc, overDepth };
    const operation = DndOperationDispatcher.dispatch(context);
    if (operation) {
      const { form, toc: newToc } = operation.relocate(context);
      const prevToc = toc;
      setToc(newToc);
      // api 요청
      relocateNodeApi(form).then((result) => {
        if (result.code === "success") {
          // 성공
        } else {
          setToc(prevToc);
          notification.error(result.message);
        }
      })
    }
  }, [notification, setToc, toc])

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      // modifiers={[restrictToVerticalAxis]}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
    >
      <List>
        {toc.root.children.map(child => renderTocNode(child, 0))}
      </List>
      <OverlayProvider />
    </DndContext>
  )
}