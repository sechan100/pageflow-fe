import { useCallback } from "react";
import { create } from "zustand";
import { useReadingUnitExplorer } from "../../stores/reading-unit-store";
import { usePageMeasurementStore } from "./page-measurement";
import { useScrollContainerContext } from "./scroll-container-context";

const getMeasurement = () => usePageMeasurementStore.getState();

type PageControllStore = {
  currentPage: number;
  /**
   * 이전 unit으로 넘어갈 때, 반드시 한 프레임에 scrollContainer 아래의 모든 unit content들이 렌더링되리란 보장은 없다.
   * 때문에 여러번에 걸쳐서 scrollWidth, 결국에는 totalPageCount가 바뀔 수 있다.
   * 문제는, 이전 unit으로 넘어갈 때 마지막 페이지를 보여줘야하는데 totalPageCount가 여러차례에 걸쳐서 업데이트되면 최종적으로 올바른 마지막 페이지를 보여줄 수 없다.
   * 때문에 이전 unit으로 넘어가는 경우에 한하여, shouldFixOnEndPage를 true로 설정한다.
   * 이러면 만약 totalPageCount가 바뀌더라도 해당 flag가 true일 때 다시 page를 올바르게 맨 뒤로 조정하여 결국 올바르게 마지막 페이지를 보여줄 수 있다.
   */
  shouldFixOnEndPage: boolean;
}
const usePageControlStore = create<PageControllStore>(() => ({
  currentPage: 0,
  shouldFixOnEndPage: false,
}));
const getCurrentPage = () => usePageControlStore.getState().currentPage;
const getShouldFixOnEndPage = () => usePageControlStore.getState().shouldFixOnEndPage;

export const usePageControl = () => {
  const containerRef = useScrollContainerContext();
  const { moveUnitTo } = useReadingUnitExplorer();

  const log = useCallback(() => {
    // console.log("[페이지]", currentPageRef.current + 1, "/", getMeasurement().totalPageCount);
  }, []);

  const goToPageAt = useCallback((newPage: number) => {
    const container = containerRef.current;
    if (!container) return;
    if (newPage < 0 || newPage >= getMeasurement().totalPageCount) throw new Error("page out of bound");
    const diff = getMeasurement().pageBreakPointCommonDifference;
    container.scrollTo({
      left: newPage * diff,
      behavior: "instant",
    });
    usePageControlStore.setState({ currentPage: newPage });
    log();
  }, [containerRef, log]);

  /**
   * page가 경계를 넘어간 경우 호출
   */
  const onPageOverflow = useCallback((edge: "prev" | "next") => {
    // 앞으로 넘어갔다면, 이전 유닛의 맨 뒷 페이지에 page를 고정, 또는 vice versa
    // console.log("[Overflow]", edge === "prev" ? "<-" : "->");
    const moveSuccess = moveUnitTo(edge);
    if (!moveSuccess) return;

    const newPage = edge === "next" ? 0 : getMeasurement().totalPageCount - 1;
    goToPageAt(newPage);
    // 이전 페이지로 넘어갔다면 마지막 페이지 고정
    if (edge === "prev") {
      usePageControlStore.setState({ shouldFixOnEndPage: true });
    }
  }, [moveUnitTo, goToPageAt]);

  /**
   * 1개의 페이지만큼 스크롤을 이동시키는 함수
   */
  const movePageByOne = useCallback((to: "prev" | "next") => {
    // if (isScrolling) return;
    const totalPageCount = getMeasurement().totalPageCount;
    const currentPage = getCurrentPage();

    // 다시 페이지를 앞뒤로 움직일 때는 fix를 푼다.
    usePageControlStore.setState({ shouldFixOnEndPage: false });

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
    goToPageAt(newPage);
  }, [goToPageAt, onPageOverflow]);

  /**
   * scrollLeft가 currentPage와 어긋났을 때, currentPage를 기준으로보고 scrollLeft를 새롭게 조정한다.
   * 주로 scrollWidth가 바뀌었을 때 어긋난다.
   */
  const adjustScrollLeft = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const diff = getMeasurement().pageBreakPointCommonDifference;
    const newScrollLeft = getCurrentPage() * diff;
    container.scrollTo({
      left: newScrollLeft,
      behavior: "instant",
    });
  }, [containerRef]);

  /**
   * PageMeasurement가 재측정된 후, 실행해야하는 콜백
   */
  const afterReMeasurement = useCallback(() => {
    // 맨 뒷페이로 고정되어있다면 바로 이동시킨다.
    if (getShouldFixOnEndPage()) {
      goToPageAt(getMeasurement().totalPageCount - 1)
    }
  }, [goToPageAt]);

  return {
    getCurrentPage,
    movePageByOne,
    goToPageAt,
    afterReMeasurement,
    adjustScrollLeft,
  }
}