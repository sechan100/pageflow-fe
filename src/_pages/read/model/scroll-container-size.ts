import { debounce } from "lodash";

export type ScrollContainerSize = {
  width: number;
  height: number;
  scrollWidth: number;
  scrollLeft: number;
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

export const registerScrollContainerSizeObserver = (el: HTMLElement, onSizeChange: (size: ScrollContainerSize) => void) => {
  const reMeasure = () => {
    const newSize = measureSize(el);
    onSizeChange(newSize);
  }

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
  }

};
