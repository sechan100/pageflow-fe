import { debounce } from "lodash";
import { RefObject, useEffect, useState } from "react";
import { contentRenderedEvent, readableUnitChangedEvent } from "../../model/reader-event";



export const useContainerSize = (ref: RefObject<HTMLElement | null>) => {
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
    const resizeCallback = debounce<ResizeObserverCallback>((entries) => {
      for (const entry of entries) {
        const scrollContainer = entry.target as HTMLDivElement;
        const scrollWidth = scrollContainer.scrollWidth;
        const scrollLeft = scrollContainer.scrollLeft;
        const { width, height } = entry.contentRect;
        if (width !== size.width ||
          height !== size.height ||
          scrollWidth !== size.scrollWidth ||
          scrollLeft !== size.scrollLeft) {
          setSize({ width, height, scrollWidth, scrollLeft });
        }
      }
    }, 100);
    const resizeObserver = new ResizeObserver(resizeCallback);

    /**
     * content가 렌더링되면 일부러 상태를 변경해서 observe를 다시 실행 
     * -> content가 모두 렌더링된 상태에서의 scrollWidth로 재계산
     */
    const rmContentRenderedListener = contentRenderedEvent.registerListener(() => {
      setSize({ ...size });
    });

    /**
     * readableUnit이 변경되면 컨텐츠가 변경되므로 새로운 scrollWidth로 재계산이 필요.
     */
    const rmReadableUnitChangedListener = readableUnitChangedEvent.registerListener(() => {
      setSize({ ...size });
    });

    resizeObserver.observe(el);
    return () => {
      resizeObserver.disconnect();
      rmContentRenderedListener();
      rmReadableUnitChangedListener();
    };
  }, [ref, size]);

  return size;
};
