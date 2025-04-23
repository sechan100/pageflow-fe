'use client'
import { Box, SxProps } from "@mui/material";
import { RefObject, useEffect, useRef, useState } from "react";
import { readerController } from "../model/reader-controller";
import { useLayoutStore } from "../model/use-reader-layout-store";

const columnGapRatio = 0.1;
const columnWidthRatio = (1 - columnGapRatio) / 2;


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


type Args = {
  width: number;
  scrollWidth: number;
}
const useCalculatePages = ({ width, scrollWidth }: Args) => {
  /**
   * 모든 수치들은 width 값이다.
   * 사용되는 값들은 
   * - column: css columns의 columnWidth
   * - gap: css columns의 columnGap
   * - halfPage: 하나의 column과 하나의 gap을 합친 수치
   * -pageBreakPointCommonDifference: 페이지가 바뀌는 지점을 각 항으로 하는 등차수열의 공차(첫 항 = 0)
   */
  const gap = width * columnGapRatio;
  const column = width * columnWidthRatio;
  const halfPage = column + gap;
  const pageBreakPointCommonDifference = halfPage * 2;

  /**
   * 칼럼은 column, gap 순서대로 번갈아가며 등장하다가, 마지막에는 column으로 끝난다. 
   * halfPage는 column과 gap을 합친 수치로, 마지막에 gap으로 끝나는 경우에 'halfPageCount * 2 = pageCount'가 맞아 떨어진다.
   * 때문에 전체 scrollWidth에 gap을 하나 더한 후 halfPage로 나누어 페이지 수를 구한다.
   * 
   * 다만, 마지막 페이지가 반쪽짜리인 경우에 대비해서 언제나 컨테이너 마지막에 가상 반페이지를 추가해두기 때문에,
   * 1개의 halfPage 개수를 빼줘야한다.
   * 예를 들어, halfPageCount가 6이라면 딱 3페이지로 맞아 떨어진다. 하지만 마지막 가상 반페이지 때문에 
   * 계산하면 실제로는 7개의 halfPage로 계산된다. 따라서 1개를 감하여 6개로 조정해줘야한다.
   */
  const halfPageCount = Math.round((scrollWidth + gap) / halfPage) - 1;

  /**
   * halfPage 개수가 홀수개인지 확인. -> 홀수개라면 마지막 페이지는 반쪽페이지
   * 페이지 수는 2개의 반페이지를 합쳐서 1개로 세고, 마지막은 반페이지는 1개든 2개든 1개로 셈.
   */
  const isLastFullPage = halfPageCount % 2 === 0;
  const pageCount = Math.floor(halfPageCount / 2) + (isLastFullPage ? 0 : 1);

  return {
    gap,
    column,
    halfPage,
    pageBreakPointCommonDifference,
    pageCount,
    isLastFullPage
  }
}

type UseScrollControllArgs = {
  scrollContainerRef: RefObject<HTMLDivElement | null>;
  pageBreakPointCommonDifference: number;
  pageCount: number;
}
const useScrollControll = ({
  scrollContainerRef,
  pageBreakPointCommonDifference,
  pageCount,
}: UseScrollControllArgs) => {


  // PREV
  useEffect(() => readerController.registerToPrevListener(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    if (container.scrollLeft <= 0) return;
    container.scrollTo({
      left: container.scrollLeft - pageBreakPointCommonDifference,
      behavior: "smooth",
    });
  }), [pageBreakPointCommonDifference, scrollContainerRef]);

  // NEXT
  useEffect(() => readerController.registerToNextListener(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    if (container.scrollLeft >= container.scrollWidth) return;
    container.scrollTo({
      left: container.scrollLeft + pageBreakPointCommonDifference,
      behavior: "smooth",
    })
  }), [pageBreakPointCommonDifference, scrollContainerRef]);

}


type Props = {
  children: React.ReactNode;
  sx?: SxProps;
}
export const ReaderScrollContainer = ({
  children,
  sx
}: Props) => {
  const layout = useLayoutStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { width, height, scrollLeft, scrollWidth } = useElementProperties(scrollContainerRef);

  const { isLastFullPage, pageCount, pageBreakPointCommonDifference } = useCalculatePages({ scrollWidth, width })
  useScrollControll({
    scrollContainerRef,
    pageBreakPointCommonDifference,
    pageCount
  });


  return (
    <Box
      component="section"
      className="reader-scroll-container"
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
        "& > div > *:last-child::after": {
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