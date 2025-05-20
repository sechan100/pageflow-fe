import { useCallback, useRef } from "react";




type UseInfiniteScrollObserverArgs = {
  onLoadMore: () => Promise<void> | void;
}
type UseInfiniteScrollObserverResult = {
  lastItemRef: (el: HTMLElement | null) => void;
}
export const useInfiniteScrollObserver = ({ onLoadMore }: UseInfiniteScrollObserverArgs): UseInfiniteScrollObserverResult => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const loadMore = useCallback(async () => {
    await onLoadMore();
  }, [onLoadMore]);

  const lastItemRef = useCallback((el: HTMLElement | null) => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        loadMore();
      }
    }, { threshold: 0 });
    if (el) observerRef.current.observe(el);
  }, [loadMore]);

  return {
    lastItemRef,
  }
}