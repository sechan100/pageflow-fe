import { debounce } from "lodash";
import { RefObject, useCallback, useEffect } from "react";
import { ScrollContainerSize, useContainerStore } from "./use-container-store";


const isSameSize = (a: ScrollContainerSize, b: ScrollContainerSize) => {
  return a.width === b.width && a.height === b.height && a.scrollWidth === b.scrollWidth && a.scrollLeft === b.scrollLeft;
}

const measureSize = (el: HTMLElement) => {
  const scrollWidth = el.scrollWidth;
  const scrollLeft = el.scrollLeft;

  const style = getComputedStyle(el);
  // / 0.5는 보정값
  const width = el.clientWidth - (parseFloat(style.paddingLeft) + parseFloat(style.paddingRight) + 0.5);
  const height = el.clientHeight - (parseFloat(style.paddingTop) + parseFloat(style.paddingBottom) + 0.5);
  const newSize = { width, height, scrollWidth, scrollLeft };
  return newSize;
}


export const useScrollContainerSize = (ref: RefObject<HTMLElement | null>) => {
  const containerSize = useContainerStore(s => s.containerSize);
  const setContainerSize = useContainerStore(s => s.setContainerSize);

  const updateSize = useCallback((el: HTMLElement) => {
    const newSize = measureSize(el);
    if (!isSameSize(containerSize, newSize)) {
      console.log(`[재측정]`, newSize);
      setContainerSize(newSize);
    }
  }, [containerSize, setContainerSize]);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    const observer = new MutationObserver(() => {
      updateSize(el);
    });

    observer.observe(el, {
      childList: true,
      subtree: true,
      characterData: true
    });
    return () => {
      observer.disconnect();
    }
  }, [updateSize, ref, setContainerSize]);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    const resizeCallback: ResizeObserverCallback = debounce((entries) => {
      for (const entry of entries) {
        updateSize(el);
      }
    }, 0);
    const resizeObserver = new ResizeObserver(resizeCallback);
    resizeObserver.observe(el);
    return () => {
      resizeObserver.unobserve(el);
    }
  }, [ref, updateSize]);

};
