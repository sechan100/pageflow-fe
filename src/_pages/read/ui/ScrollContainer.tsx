'use client'
import { Box, SxProps } from "@mui/material";
import { useRef } from "react";
import { useTocContext } from "../model/context/toc-context";
import { usePageMeasurement, usePageMeasurementStore } from "../model/page-measurement";
import { useReadingBookmark } from "../model/reading-bookmark";
import { usePages } from "../model/use-pages";
import { useReaderStyleStore } from "../stores/use-reader-style-store";


export const columnGapRatio = 0.1;
export const columnWidthRatio = (1 - columnGapRatio) / 2;

type Props = {
  children: React.ReactNode;
  sx?: SxProps;
}
export const ScrollContainer = ({
  children,
  sx
}: Props) => {
  const layout = useReaderStyleStore();
  const toc = useTocContext();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  usePageMeasurement(scrollContainerRef);
  const { width } = usePageMeasurementStore(s => s.scrollContainerSize);

  useReadingBookmark({ scrollContainerRef });
  usePages(scrollContainerRef);

  return (
    <Box
      component="main"
      className="reader-scroll-container"
      ref={scrollContainerRef}
      sx={{
        position: 'relative',
        width: `${layout.viewportWidth}vw`,
        height: `${layout.viewportHeight}vh`,
        columnCount: 2,
        columnGap: `${width * columnGapRatio}px`,
        columnWidth: `${width * columnWidthRatio}px`,
        columnFill: "balance",
        overflowX: "hidden",

        /**
         * 가로축 미세 오차 때문에 글자가 잘리는 경우를 방지
         * 이게 페이지가 많이 넘어가다보면 소숫점 오차 때문에 옆으로 계속 밀려서 5(40px)정도는 줘야 괜찮음
         */
        px: 5,

        fontSize: layout.fontSize,
        lineHeight: layout.lineHeight,

        "& .pf-p": {
          textAlign: "justify",
          wordBreak: "break-all",
          orphans: "1 !important",
          widows: "1 !important",
          m: 0,
        },

        /**
         * 마지막에 반쪽짜리 페이지가 남는 경우를 위해서 항상 가짜 halfPage를 만들어준다.
         * 마지막 페이지가 온전하게 끝나는 경우 그냥 여기는 안보여주면 됨.
         * 해당 페이지 존재 여부에 따라서 scrollWidth page 계산 로직을 달리해야한다.
         */
        "& > *:last-child::after": {
          content: "''",
          visibility: "hidden",
          userSelect: "none",
          display: "block",
          breakBefore: "column",
        }
      }}
    >
      {children}
    </Box >
  )
}