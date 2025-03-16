'use client'
import { closestCenter, DndContext, DragEndEvent, DragMoveEvent, DragStartEvent, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core"
import { List, SxProps } from "@mui/material"
import { useCallback } from "react"
import { dndConfig } from "../config"
import { extractTocNodeDndData } from "../model/dnd/dnd-data"
import { dispatchDndOperation } from "../model/dnd/dnd-operation"
import { useIndicatorStore } from "../model/dnd/use-indicator"
import { useToc } from "../model/use-toc"
import { OverlayProvider } from "./OverlayProvider"
import { renderTocNode } from "./render-toc-node"



type Props = {
  sx?: SxProps
}
export const TocRoot = ({
  sx
}: Props) => {
  const toc = useToc(s => s.toc);
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

  const handleDragStart = useCallback(({ active }: DragStartEvent) => {
    console.log('drag start')
  }, [])

  const handleDragMove = useCallback(({ active, over }: DragMoveEvent) => {
    if (!over) return;
    const { depth: overDepth } = extractTocNodeDndData(over);
    const context = { active, over, toc, overDepth };
    const operation = dispatchDndOperation(context);;
    if (operation) {
      console.log(operation);
      setIndicator(String(over.id), operation.getIndicatorMode(context));
    } else {
      clearIndicator();
    }
  }, [clearIndicator, setIndicator, toc])

  const handleDragEnd = useCallback(({ active, over }: DragEndEvent) => {
    console.log('drag end')
  }, [])

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      // modifiers={[restrictToVerticalAxis]}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragMove={handleDragMove}
    >
      <List>
        {toc.root.children.map(child => renderTocNode(child, 0))}
      </List>
      <OverlayProvider />
    </DndContext>
  )
}