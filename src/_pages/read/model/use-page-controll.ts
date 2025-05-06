import { RefObject, useCallback, useEffect, useRef } from "react";
import { useReadingUnitExplorer } from "../stores/reading-unit-store";
import { registerPageMeasurementListener, usePageMeasurementStore } from "./page-measurement";
import { pageMover } from "./page-mover";

const getMeasurement = () => usePageMeasurementStore.getState();

export const usePageControll = (containerRef: RefObject<HTMLElement | null>) => {

  /**
   * 이전 unit으로 넘어갈 때, 반드시 한 프레임에 scrollContainer 아래의 모든 unit content들이 렌더링되리란 보장은 없다.
   * 때문에 여러번에 걸쳐서 scrollWidth, 결국에는 totalPageCount가 바뀔 수 있다.
   * 문제는, 이전 unit으로 넘어갈 때 마지막 페이지를 보여줘야하는데 totalPageCount가 여러차례에 걸쳐서 업데이트되면 최종적으로 올바른 마지막 페이지를 보여줄 수 없다.
   * 때문에 이전 unit으로 넘어가는 경우에 한하여, shouldFixOnEndPage를 true로 설정한다.
   * 이러면 만약 totalPageCount가 바뀌더라도 해당 flag가 true일 때 다시 page를 올바르게 맨 뒤로 조정하여 결국 올바르게 마지막 페이지를 보여줄 수 있다.
   */
  const shouldFixOnEndPage = useRef<boolean>(false);
  const currentPageRef = useRef<number>(0);

  const { moveUnitTo } = useReadingUnitExplorer();

  const log = useCallback(() => console.log("[페이지]", currentPageRef.current + 1, "/", getMeasurement().totalPageCount), []);

  const updatePage = useCallback((newPage: number) => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const diff = getMeasurement().pageBreakPointCommonDifference;
    container.scrollTo({
      left: newPage * diff,
      behavior: "instant",
    });
    currentPageRef.current = newPage;
    log();
  }, [containerRef, log]);

  /**
   * page가 경계를 넘어간 경우 호출
   */
  const onPageOverflow = useCallback((edge: "prev" | "next") => {
    // 앞으로 넘어갔다면, 이전 유닛의 맨 뒷 페이지에 page를 고정, 또는 vice versa
    console.log("[Overflow]", edge === "prev" ? "<-" : "->");
    const moveSuccess = moveUnitTo(edge);
    if (!moveSuccess) return;

    const newPage = edge === "next" ? 0 : getMeasurement().totalPageCount - 1;
    updatePage(newPage);
    // 이전 페이지로 넘어갔다면 마지막 페이지 고정
    if (edge === "prev") {
      shouldFixOnEndPage.current = true;
    }
  }, [moveUnitTo, updatePage]);

  /**
   * 1개의 페이지만큼 스크롤을 이동시키는 함수
   */
  const movePageTo = useCallback((to: "prev" | "next") => {
    // if (isScrolling) return;
    const currentPage = currentPageRef.current;
    const totalPageCount = getMeasurement().totalPageCount;

    // 다시 페이지를 앞뒤로 움직일 때는 fix를 푼다.
    shouldFixOnEndPage.current = false;

    /**
     * 이동방향에 따른 경계를 체크하고, 경계를 넘어갈 수 없도록 한다.
     */
    if (to === "prev") {
      if (currentPage === 0) {
        onPageOverflow("prev")
        return;
      }
    } else {
      if (currentPage >= totalPageCount - 1) {
        onPageOverflow("next");
        return;
      }
    }
    // setIsScrolling(true);
    const newPage = to === "prev" ? currentPage - 1 : currentPage + 1;
    updatePage(newPage);
  }, [updatePage, onPageOverflow]);

  /**
   * scrollWidth가 바뀌었을 때, currentPage에 맞게 scrollLeft를 새롭게 조정
   */
  const onScrollWidthChanged = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    console.log("[scrollWidth changed]", container.scrollWidth);
    const diff = getMeasurement().pageBreakPointCommonDifference;
    const newScrollLeft = currentPageRef.current * diff;
    container.scrollTo({
      left: newScrollLeft,
      behavior: "instant",
    });
  }, [containerRef]);

  const onTotalPageCountChanged = useCallback(() => {
    if (shouldFixOnEndPage.current) {
      updatePage(getMeasurement().totalPageCount - 1)
    }
  }, [updatePage]);

  /**
   * PageMeasurement가 재측정될 때, 적절한 콜백들을 호출한다.
   */
  useEffect(() => {
    const unregister = registerPageMeasurementListener(({ newMeasurement, prev }) => {
      const isScrollWidthChanged = prev.scrollContainerSize.scrollWidth !== newMeasurement.scrollContainerSize.scrollWidth;
      const isTotalPageCountChanged = prev.totalPageCount !== newMeasurement.totalPageCount;
      if (isScrollWidthChanged) onScrollWidthChanged();
      if (isTotalPageCountChanged) onTotalPageCountChanged();
    })
    return () => unregister();
  }, [containerRef, containerRef, onScrollWidthChanged, onTotalPageCountChanged]);

  /**
   * moveScroll, onScrollEnd 콜백들을 등록
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // const onScrollEnd = () => setIsScrolling(false);
    const prevListenerCleanUp = pageMover.registerToPrevListener(() => movePageTo("prev"));
    const nextListenerCleanUp = pageMover.registerToNextListener(() => movePageTo("next"));
    // container.addEventListener("scrollend", onScrollEnd);
    return () => {
      prevListenerCleanUp();
      nextListenerCleanUp();
      // container.removeEventListener("scrollend", onScrollEnd);
    }
  }, [containerRef, movePageTo]);
}