'use client'
import { closestCenter, DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext } from "@dnd-kit/sortable"
import { SxProps } from "@mui/material"
import { useCallback, useMemo, useState } from "react"
import { dndConfig } from "../config/dnd-config"
import { useToc } from "../model/use-toc"
import { renderTocNode } from "./render-toc-node"



type Props = {
  sx?: SxProps
}
export const TocRoot = ({
  sx
}: Props) => {
  const toc = useToc(s => s.toc);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor)
  );

  const items = useMemo(() => toc.root.children.map(c => c.id), [toc.root.children]);


  const [activeId, setActiveId] = useState<string | null>(null);

  const handleDragStart = useCallback(({ active }: DragStartEvent) => {
    setActiveId(String(active.id))
    console.log('drag start')
  }, [])

  const handleDragEnd = useCallback(({ active, over }: DragEndEvent) => {
    setActiveId(null)

    if (!over) return;
  }, [])

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      // modifiers={[restrictToParentElement]}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items}
        strategy={dndConfig.sortableStrategy}
      >
        {toc.root.children.map(child => renderTocNode(child, 0))}
        <DragOverlay>
          {activeId ? (
            <div>
              {activeId} 이동하라.
            </div>
          ) : null}
        </DragOverlay>
      </SortableContext>
    </DndContext>
  )
}