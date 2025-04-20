'use client'
import { Box, SxProps } from "@mui/material";
import { RefObject, useEffect, useRef, useState } from "react";
import { useLayoutStore } from "../../model/use-reader-layout-store";
import { columnGapRatio, columnWidthRatio } from "./section-columns";
import { useCalculatePages } from "./use-calculate-pages";



const useElementProperties = (ref: RefObject<HTMLElement | null>) => {
  const [size, setSize] = useState({
    width: 0,
    height: 0,
    scrollWidth: 0,
    scrollLeft: 0,
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const scrollContainer = entry.target as HTMLDivElement;
        const scrollWidth = scrollContainer.scrollWidth;
        const scrollLeft = scrollContainer.scrollLeft;
        const { width, height } = entry.contentRect;
        if (
          width !== size.width ||
          height !== size.height ||
          scrollWidth !== size.scrollWidth ||
          scrollLeft !== size.scrollLeft
        ) {
          setSize({ width, height, scrollWidth, scrollLeft });
        }
      }
    });
    resizeObserver.observe(el);
    return () => resizeObserver.unobserve(el);
  }, [ref, size]);

  return size;
}


type Props = {
  children: React.ReactNode;
  sx?: SxProps;
}
export const ContentContainer = ({
  children,
  sx
}: Props) => {
  const layout = useLayoutStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { width, height, scrollLeft, scrollWidth } = useElementProperties(scrollContainerRef);

  const { isLastPageHalf, pageCount } = useCalculatePages({ scrollWidth, width })
  console.log("pages", pageCount, isLastPageHalf);


  return (
    <Box
      component="section"
      className="section-reader"
      ref={scrollContainerRef}
      sx={{
        position: 'relative',
        width: layout.width,
        height: layout.height,
        columnCount: 2,
        columnGap: `${width * columnGapRatio}px`,
        columnWidth: `${width * columnWidthRatio}px`,
        columnFill: "auto",
        overflowY: "scroll",

        fontSize: layout.fontSize,
        lineHeight: layout.lineHeight,

        "& .pf-p": {
          textAlign: "justify",
          // wordBreak: "break-all",
          // widows: 1,
          // orphans: 1,
          m: 0,
        },

        // 마지막에 반쪽짜리 페이지가 남는 경우를 위한 
        // "& > div > *:last-child::after": {
        //   content: "''",
        //   visibility: "hidden",
        //   userSelect: "none",
        //   display: "block",
        //   breakBefore: "column",
        // }
      }}
    >
      {children}
    </Box >
  )
}