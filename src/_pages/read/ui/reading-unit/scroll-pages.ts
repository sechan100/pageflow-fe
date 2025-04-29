import { debounce } from "lodash";
import { RefObject, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { readerController } from "../../model/reader-controller";
import { readerEvent } from "../../model/reader-event";
import { reCalculatePages, useCalculatedPages } from "./use-calculated-pages";
import { useContainerStore } from "./use-container-store";



export const usePages = (containerRef: RefObject<HTMLElement | null>) => {
  const containerSize = useContainerStore(s => s.containerSize);
  const leadNodeInfo = useContainerStore(s => s.leadNodeInfo);
  const {
    gap,
    column,
    halfPage,
    pageBreakPointCommonDifference,
    totalPageCount,
    isLastFullPage
  } = useCalculatedPages();

  const currentPageRef = useRef<number>(0);

  /**
   * containserSize가 변경되면 pages를 재계산
   */
  useEffect(() => {
    reCalculatePages({ width: containerSize.width, scrollWidth: containerSize.scrollWidth });
  }, [containerSize]);

  const pageTo = useCallback((to: "start" | "end") => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    const newPage = to === "start" ? 0 : totalPageCount - 1;
    container.scrollTo({
      left: newPage * pageBreakPointCommonDifference,
      behavior: "instant",
    });
    currentPageRef.current = newPage;
  }, [containerRef, pageBreakPointCommonDifference, totalPageCount]);

  const LOGPAGE = useCallback(() => console.log("[페이지]", currentPageRef.current + 1, "/", totalPageCount), [totalPageCount]);

  /**
   * 스크롤 이동 중
   */
  const [isScrolling, setIsScrolling] = useState(false);

  /**
   * scrollWidth가 바뀌었을 때, currentPage에 맞게 scrollLeft를 새롭게 조정
   */
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const resizeCallbackDebounced = debounce<ResizeObserverCallback>((entries) => entries.forEach(entry => {
      if (entry.target.scrollWidth === containerSize.scrollWidth) return;
      const newScrollLeft = currentPageRef.current * pageBreakPointCommonDifference;
      container.scrollTo({
        left: newScrollLeft,
        behavior: "instant",
      });
    }), 100);

    const resizeObserver = new ResizeObserver(resizeCallbackDebounced);
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [containerRef, pageBreakPointCommonDifference, containerSize]);

  /**
   * 1개의 페이지만큼 스크롤을 이동시키는 함수
   */
  const moveScroll = useCallback((direction: "prev" | "next") => {
    const container = containerRef.current;
    if (!container) return;
    if (isScrolling) return;
    const currentPage = currentPageRef.current;

    /**
     * 이동방향에 따른 경계를 체크하고, 경계를 넘어갈 수 없도록 한다.
     * 대신 pageOverflowEvent를 발행한다.
     */
    if (direction === "prev") {
      if (currentPage === 0) {
        readerEvent.emit("page-overflow", { edge: "start" })
        return;
      }
    } else {
      if (currentPage >= totalPageCount - 1) {
        readerEvent.emit("page-overflow", { edge: "end" });
        return;
      }
    }
    setIsScrolling(true);
    const newScrollLeft = container.scrollLeft + (direction === "prev" ? -pageBreakPointCommonDifference : pageBreakPointCommonDifference);
    container.scrollTo({
      left: newScrollLeft,
      behavior: "instant",
    });
    const newPage = direction === "prev" ? currentPage - 1 : currentPage + 1;
    currentPageRef.current = newPage;
    LOGPAGE();
  }, [LOGPAGE, containerRef, isScrolling, pageBreakPointCommonDifference, totalPageCount]);

  /**
   * moveScroll 함수로 스크롤 이동이 완료된 후에 호출
   */
  const onScrollEnd = useCallback(() => {
    setIsScrolling(false);
    // currentPage 상태가 업데이트되기 전에 onScrollEnd가 호출될 수 있음 -> ref로 참조
    const newPage = currentPageRef.current;
    readerEvent.emit("page-changed", {
      currentPage: newPage,
      totalPageCount: totalPageCount,
    })
  }, [totalPageCount])

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
   * totalPage가 변경되면 'totalPagesChanged' 이벤트를 발행
   */
  useEffect(() => {
    readerEvent.emit("total-page-count-changed", {
      currentPage: currentPageRef.current,
      totalPageCount: totalPageCount,
    })
  }, [totalPageCount]);

  /**
   * leadNode가 변경되면 containerSize가 재측정된 이후에 page를 시작, 또는 끝으로 조정
   */
  useLayoutEffect(() => {
    console.log("페이지 재조정: ", leadNodeInfo.readFrom);
    pageTo(leadNodeInfo.readFrom);
    LOGPAGE();
    // containerSize를 의존성 배열에 추가하여, containerSize가 재측정될 때마다 페이지를 재조정
  }, [LOGPAGE, leadNodeInfo.readFrom, pageTo, containerSize]);

  return {
    gap,
    column,
    width: containerSize.width,
    scrollWidth: containerSize.scrollWidth,
    halfPage,
    pageBreakPointCommonDifference,
    totalPageCount,
    isLastFullPage
  }
}