'use client'
import { registerKeyboardShortCut } from "@/shared/keyboard";
import { Box, SxProps } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { pageMover } from "../../model/page-mover";


const chevronSize = 30;


type Props = {
  direction: "left" | "right";
  top?: string;
  horizontalDistance?: string;
  sx?: SxProps;
}
export const ControllerChevron = ({
  direction,
  top,
  horizontalDistance,
  sx
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const moveFn = useMemo(() => {
    if (direction === "left") {
      return () => pageMover.toPrev();
    } else {
      return () => pageMover.toNext();
    }
  }, [direction]);

  useEffect(() => {
    if (!ref.current) return;

    return registerKeyboardShortCut({
      element: document.querySelector("html") as HTMLElement,
      cb: moveFn,
      key: direction === "left" ? "ArrowLeft" : "ArrowRight",
    })
  }, [direction, moveFn]);

  return (
    <Box
      ref={ref}
      onClick={moveFn}
      sx={{
        position: "absolute",
        p: 5,
        cursor: "pointer",
        top: top,
        left: direction === "left" ? horizontalDistance : undefined,
        right: direction === "right" ? horizontalDistance : undefined,
      }}
    >
      {direction === "left"
        ?
        <ChevronLeft size={chevronSize} />
        :
        <ChevronRight size={chevronSize} />
      }
    </Box>
  )
}