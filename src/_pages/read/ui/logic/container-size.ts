import { debounce } from "lodash";
import { readerEvent } from "../../model/reader-event";


export type ScrollContainerSize = {
  width: number;
  height: number;
  scrollWidth: number;
  scrollLeft: number;
}

type MeasureCallback = (size: ScrollContainerSize) => void;

const measureScrollContainer = (container: HTMLElement, cb: MeasureCallback) => {
  const scrollWidth = container.scrollWidth;
  const scrollLeft = container.scrollLeft;
  const { width, height } = container.getBoundingClientRect();
  const size: ScrollContainerSize = {
    width,
    height,
    scrollWidth,
    scrollLeft
  }
  cb(size);
}

export const registerScrollContainerMeasure = (container: HTMLElement, cb: MeasureCallback) => {
  const resizeCallback = debounce<ResizeObserverCallback>((entries) => {
    for (const entry of entries) {
      measureScrollContainer(entry.target as HTMLElement, cb);
    }
  }, 100);
  const resizeObserver = new ResizeObserver(resizeCallback);


  const reMeasure = () => {
    measureScrollContainer(container, cb);
  }
  /**
   * content가 렌더링되면 일부러 상태를 변경해서 observe를 다시 실행 
   * -> content가 모두 렌더링된 상태에서의 scrollWidth로 재계산
   */
  readerEvent.on("content-mounted", reMeasure);

  /**
   * readableUnit이 변경되면 컨텐츠가 변경되므로 새로운 scrollWidth로 재계산이 필요.
   */
  readerEvent.on("readable-unit-changed", reMeasure);

  resizeObserver.observe(container);
  return () => {
    resizeObserver.disconnect();
    readerEvent.off("content-mounted", reMeasure);
    readerEvent.off("readable-unit-changed", reMeasure);
  };
};
