import { debounce } from "lodash";
import { RefObject, useEffect } from "react";
import { create } from "zustand";
import { columnGapRatio, columnWidthRatio } from "./ScrollContainer";


export type PageMeasurement = {
  gap: number;
  column: number;
  halfPage: number;
  pageBreakPointCommonDifference: number;
  totalPageCount: number;
  isLastFullPage: boolean;
  scrollContainerSize: ScrollContainerSize;
}

export type ScrollContainerSize = {
  width: number;
  height: number;
  scrollWidth: number;
  scrollLeft: number;
}

const fallbackPageMeasurement: PageMeasurement = {
  column: 0,
  gap: 0,
  halfPage: 0,
  isLastFullPage: false,
  pageBreakPointCommonDifference: 0,
  totalPageCount: 0,
  scrollContainerSize: {
    width: 0,
    height: 0,
    scrollWidth: 0,
    scrollLeft: 0,
  }
}

const measureSize = (el: HTMLElement): ScrollContainerSize => {
  const scrollWidth = el.scrollWidth;
  const scrollLeft = el.scrollLeft;

  const style = getComputedStyle(el);
  const offset = 0.1;
  const width = el.clientWidth - (parseFloat(style.paddingLeft) + parseFloat(style.paddingRight) + offset);
  const height = el.clientHeight - (parseFloat(style.paddingTop) + parseFloat(style.paddingBottom) + offset);
  const newSize = { width, height, scrollWidth, scrollLeft };
  return newSize;
}

const measurePage = (scrollContainerSize: ScrollContainerSize): PageMeasurement => {
  const { width, scrollWidth } = scrollContainerSize;
  /**
   * 모든 수치들은 width 값이다.
   * 사용되는 값들은 
   * - column: css columns의 columnWidth
   * - gap: css columns의 columnGap
   * - halfPage: 하나의 column과 하나의 gap을 합친 수치
   * - pageBreakPointCommonDifference: 페이지가 바뀌는 지점을 각 항으로 하는 등차수열의 공차(첫 항 = 0)
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
  const totalPageCount = Math.floor(halfPageCount / 2) + (isLastFullPage ? 0 : 1);

  return {
    gap,
    column,
    halfPage,
    pageBreakPointCommonDifference,
    totalPageCount,
    isLastFullPage,
    scrollContainerSize,
  }
}


const registerPageMeasurementMonitor = (el: HTMLElement, onMeasure: (measurement: PageMeasurement) => void) => {
  const reMeasure = () => {
    const newSize = measureSize(el);
    const measurement = measurePage(newSize);
    onMeasure(measurement);
  };

  const mutationObserver = new MutationObserver(reMeasure);
  mutationObserver.observe(el, {
    childList: true,
    subtree: true,
    characterData: true
  });
  ;
  const resizeObserver = new ResizeObserver(
    debounce(() => reMeasure(), 0)
  );
  resizeObserver.observe(el);

  return () => {
    mutationObserver.disconnect();
    resizeObserver.unobserve(el);
  };

}

const usePageMeasurementStore = create<PageMeasurement>(() => fallbackPageMeasurement);

type PageMeasurementListener = (args: {
  prev: PageMeasurement;
  newMeasurement: PageMeasurement;
}) => void;
const pageMeasurementEventListeners: PageMeasurementListener[] = [];

/**
 * usePageMeasurementStore가 업데이트 완료된 이후에 호출된다.
 */
const registerPageMeasurementListener = (listener: PageMeasurementListener) => {
  pageMeasurementEventListeners.push(listener);
  return () => {
    const index = pageMeasurementEventListeners.indexOf(listener);
    if (index > -1) {
      pageMeasurementEventListeners.splice(index, 1);
    }
  }
}

const usePageMeasurement = (containerRef: RefObject<HTMLElement | null>) => {
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const detach = registerPageMeasurementMonitor(container, (newMeasurement) => {
      const prev = usePageMeasurementStore.getState();
      usePageMeasurementStore.setState(newMeasurement);
      for (const listener of pageMeasurementEventListeners) {
        listener({
          prev,
          newMeasurement,
        });
      }
    });
    return () => {
      detach();
    };
  }, [containerRef]);
}


export {
  fallbackPageMeasurement,
  registerPageMeasurementListener,
  usePageMeasurement,
  usePageMeasurementStore
};
