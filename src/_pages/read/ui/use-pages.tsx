import { RefObject, useEffect, useState } from "react";
import { readerController } from "../model/reader-controller";
import { registerReaderEventListener } from "../model/reader-event";
import { columnGapRatio, columnWidthRatio } from "./ReaderScrollContainer";


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
    const cleanup = registerReaderEventListener("content-rendered", () => {
      resizeObserver.observe(el);
    });
    return () => {
      resizeObserver.disconnect();
      cleanup();
    }
  }, [ref, size]);

  return size;
}

const calculatePage = ({ width, scrollWidth }: { width: number, scrollWidth: number }) => {
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


export const usePages = (containerRef: RefObject<HTMLElement | null>) => {
  const { width, scrollWidth } = useElementProperties(containerRef);
  const {
    gap,
    column,
    halfPage,
    pageBreakPointCommonDifference,
    pageCount,
    isLastFullPage
  } = calculatePage({ width, scrollWidth });

  const [currentPage, setCurrentPage] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  // scroll 이벤트 등록
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scrollHandler = (direction: "prev" | "next") => {
      if (isScrolling) return;
      // 방향에 따른 동작조건 체크
      if (direction === "prev") {
        if (currentPage === 0) return;
      } else {
        // TODO: Page 데이터를 만들고, page가 마지막이라면 못 넘어가게 막기
        if (currentPage === pageCount - 1) return;
      }
      setIsScrolling(true);

      const newScrollLeft = container.scrollLeft + (direction === "prev" ? -pageBreakPointCommonDifference : pageBreakPointCommonDifference);
      container.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
      setCurrentPage((prev) => direction === "prev" ? --prev : ++prev);
    }

    const prevListenerCleanUp = readerController.registerToPrevListener(() => scrollHandler("prev"));
    const nextListenerCleanUp = readerController.registerToNextListener(() => scrollHandler("next"));
    const handler = () => setIsScrolling(false);
    container.addEventListener("scrollend", handler);
    return () => {
      prevListenerCleanUp();
      nextListenerCleanUp();
      container.removeEventListener("scrollend", handler);
    }
  }, [containerRef, currentPage, isScrolling, pageBreakPointCommonDifference, pageCount]);

  return {
    gap,
    column,
    width,
    scrollWidth,
    halfPage,
    pageBreakPointCommonDifference,
    pageCount,
    isLastFullPage
  }
}