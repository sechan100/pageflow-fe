import { ReadableTocNodeType } from "@/entities/book";
import { createStoreContext } from "@/shared/zustand/create-store-context";
import { useCallback, useEffect, useState } from "react";
import { StoreApi } from "zustand";
import { getBookmarkOrNullApi } from "../api/reading-bookmark";
import { useReadingUnitStore } from "./reading-unit-store";

export type ReadingBookmark = {
  tocNodeType: ReadableTocNodeType;
  tocNodeId: string;
  /**
   * 0부터 시작하는 section content element들의 번호
   */
  sceId: number;
};

type NavigatingStatus = "required" | "unit-rendering" | "navigated";

type BookmarkStore = {
  bookmark: ReadingBookmark | null;
  navigatingStatus: NavigatingStatus;
  setNavigatingStatus: (status: NavigatingStatus) => void;
  navigateTo: (bookmark: ReadingBookmark) => void;
}

const [Provider, useStore] = createStoreContext<ReadingBookmark | null, BookmarkStore>((data, set) => ({
  bookmark: data,
  navigatingStatus: "required",
  setNavigatingStatus: (status) => {
    set({ navigatingStatus: status });
  },
  navigateTo: (bookmark) => {
    set({ bookmark, navigatingStatus: "required" });
  },
}));

export const useBookmarkStore = useStore;

type BookmarkStoreProviderProps = {
  children: React.ReactNode;
  bookId: string;
}
export const BookmarkStoreProvider = ({ children, bookId }: BookmarkStoreProviderProps) => {
  const [bookmark, setBookmark] = useState<ReadingBookmark | null>(null);
  const sequence = useReadingUnitStore(s => s.sequence);

  useEffect(() => {
    const fetchBookmark = async () => {
      let fetched = await getBookmarkOrNullApi(bookId);
      if (fetched === null) {
        fetched = {
          tocNodeType: sequence[0].headNode.type,
          tocNodeId: sequence[0].headNode.id,
          sceId: 0,
        } as ReadingBookmark;
      }
      setBookmark(fetched);
    };
    fetchBookmark();
  }, [bookId, sequence]);

  const handleDataChange = useCallback((store: StoreApi<BookmarkStore>, newBookmark: ReadingBookmark | null) => {
    if (newBookmark === null) return;
    store.getState().navigateTo(newBookmark);
  }, []);

  return (
    <Provider data={bookmark} onDataChange={handleDataChange}>
      {children}
    </Provider>
  )
}