import { debounce } from "lodash";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { readerController } from "../../model/reader-controller";
import { pageChangedEvent } from "../../model/reader-event";
import { columnGapRatio, columnWidthRatio } from "../ReaderScrollContainer";
import { useContainerSize } from "./use-container-size";


export const calculatePage = ({ width, scrollWidth }: { width: number, scrollWidth: number }) => {
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
   * 단, 최종 결과에서 1개를 빼준다.(마지막 페이지가 반쪽짜리인 경우를 위한 가상페이지가 항상 존재함.)
   */
  const halfPageCount = Math.round((scrollWidth + gap) / halfPage) - 1;

  /**
   * halfPage 개수가 홀수개인지 확인. -> 홀수개라면 마지막 페이지는 반쪽페이지
   * 페이지 수는 2개의 반페이지를 합쳐서 1개로 세고, 마지막은 반페이지는 1개든 2개든 1개로 셈.
   */
  const isLastFullPage = halfPageCount % 2 === 0;
  const totalPage = Math.floor(halfPageCount / 2) + (isLastFullPage ? 0 : 1);

  return {
    gap,
    column,
    halfPage,
    pageBreakPointCommonDifference,
    totalPage,
    isLastFullPage
  }
}


export const usePages = (containerRef: RefObject<HTMLElement | null>) => {
  const { width, scrollWidth } = useContainerSize(containerRef);
  const {
    gap,
    column,
    halfPage,
    pageBreakPointCommonDifference,
    totalPage,
    isLastFullPage
  } = calculatePage({ width, scrollWidth });

  const currentPageRef = useRef<number>(0);

  /**
   * 스크롤 이동 중
   */
  const [isScrolling, setIsScrolling] = useState(false);

  /**
   * scrollWidth가 바뀌었을 때, currentPage에 맞게 scrollLeft를 새롭게 조정
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const resizeCallbackDebounced = debounce<ResizeObserverCallback>((entries) => entries.forEach(entry => {
      if (entry.target.scrollWidth === scrollWidth) return;
      const newScrollLeft = currentPageRef.current * pageBreakPointCommonDifference;
      container.scrollTo({
        left: newScrollLeft,
        behavior: "instant",
      });
    }), 100);

    const resizeObserver = new ResizeObserver(resizeCallbackDebounced);
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [containerRef, currentPageRef, pageBreakPointCommonDifference, scrollWidth]);

  /**
   * 1개의 페이지만큼 스크롤을 이동시키는 함수
   */
  const moveScroll = useCallback((direction: "prev" | "next") => {
    const container = containerRef.current;
    if (!container) return;
    if (isScrolling) return;
    const currentPage = currentPageRef.current;
    // 방향에 따른 동작조건 체크
    if (direction === "prev") {
      if (currentPage === 0) return;
    } else {
      // TODO: Page 데이터를 만들고, page가 마지막이라면 못 넘어가게 막기
      if (currentPage === totalPage - 1) return;
    }
    setIsScrolling(true);
    const newScrollLeft = container.scrollLeft + (direction === "prev" ? -pageBreakPointCommonDifference : pageBreakPointCommonDifference);
    container.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });
    const newPage = direction === "prev" ? currentPage - 1 : currentPage + 1;
    currentPageRef.current = newPage;
  }, [containerRef, isScrolling, pageBreakPointCommonDifference, totalPage]);

  /**
   * moveScroll 함수로 스크롤 이동이 완료된 후에 호출
   */
  const onScrollEnd = useCallback(() => {
    setIsScrolling(false);
    // currentPage 상태가 업데이트되기 전에 onScrollEnd가 호출될 수 있음 -> ref로 참조
    const newPage = currentPageRef.current;
    pageChangedEvent.emit({
      page: newPage,
      totalPages: totalPage,
    })
  }, [totalPage])

  /**
   * moveScroll, onScrollEnd 콜백들을 등록
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prevListenerCleanUp = readerController.registerToPrevListener(() => moveScroll("prev"));
    const nextListenerCleanUp = readerController.registerToNextListener(() => moveScroll("next"));
    container.addEventListener("scrollend", onScrollEnd);
    return () => {
      prevListenerCleanUp();
      nextListenerCleanUp();
      container.removeEventListener("scrollend", onScrollEnd);
    }
  }, [containerRef, moveScroll, onScrollEnd]);


  /**
   * totalPage가 변경되면 'page-changed' 이벤트를 발행
   */
  useEffect(() => {
    pageChangedEvent.emit({
      page: currentPageRef.current,
      totalPages: totalPage,
    })
  }, [totalPage]);

  return {
    gap,
    column,
    width,
    scrollWidth,
    halfPage,
    pageBreakPointCommonDifference,
    totalPage,
    isLastFullPage
  }
}