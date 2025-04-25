import { debounce } from "lodash";
import { RefObject, useEffect, useState } from "react";
import { contentRenderedEvent } from "../../model/reader-event";



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
    // content가 렌더링되면 상태를 변경해서 observe를 다시 실행 -> content가 렌더링된 상태의 scrollWidth로 시작
    const cleanup = contentRenderedEvent.registerListener(() => {
      setSize({ ...size });
    });
    resizeObserver.observe(el);
    return () => {
      resizeObserver.disconnect();
      cleanup();
    };
  }, [ref, size]);

  return size;
};
