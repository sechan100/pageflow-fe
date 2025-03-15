import { useDndMonitor } from "@dnd-kit/core";
import { useState } from "react";





export const useIsOver = (nodeId: string) => {
  const [isOver, setIsOver] = useState(false);
  useDndMonitor({
    onDragOver(event) {
      if (event.over?.id === nodeId) {
        setIsOver(true);
      }
    },
    onDragEnd() {
      setIsOver(false);
    },
    onDragCancel() {
      setIsOver(false);
    },
    onDragPending() {
      setIsOver(false);
    },
    onDragAbort() {
      setIsOver(false);
    }
  });

  return isOver;
}