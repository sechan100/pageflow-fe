import { ReadableTocNode, ReadableTocNodeType } from "@/entities/book";
import { useCallback, useEffect, useRef } from "react";
import { createStore } from "zustand";
import { getReadingBookmarkApi, saveReadingBookmarkApi } from "../../api/reading-bookmark";
import { ReadaingUnitSequence } from "../../model/reading-unit";
import { useBookContext } from "../../stores/book-context";
import { useReadingUnitExplorer, useReadingUnitStore } from "../../stores/reading-unit-store";
import { CN_SECTION_CONTENT_ELEMENT, DATA_SECTION_CONTENT_ELEMENT_ID, DATA_TOC_FOLDER_ID, DATA_TOC_SECTION_ID } from "./node-element";
import { PageMeasurement, registerPageMeasurementListener, usePageMeasurementStore } from "./page-measurement";
import { FOLDER_CONTENT_WRAPPER_CLASS_NAME, SECTION_CONTENT_WRAPPER_CLASS_NAME } from "./readable-content";
import { useScrollContainerContext } from "./scroll-container-context";
import { usePageControl } from "./use-page-control";


export type ReadingBookmark = {
  tocNodeType: ReadableTocNodeType;
  tocNodeId: string;
  /**
   * 0부터 시작하는 section content element들의 번호
   */
  sceId: number;
}

export type ReadingBookmarkStore = {
  isRestored: boolean;
  flagBookmarkRestored: () => void;
}
const readingBookmarkStore = createStore<ReadingBookmarkStore>((set) => ({
  isRestored: false,
  flagBookmarkRestored: () => set({ isRestored: true }),
}))

const FOLDER_ELEMENT_SELECTOR = `.${FOLDER_CONTENT_WRAPPER_CLASS_NAME}`;
const SECTION_ELEMENT_SELECTOR = `.${SECTION_CONTENT_WRAPPER_CLASS_NAME} .${CN_SECTION_CONTENT_ELEMENT}`;

type RegisterAnchorObserverArgs = {
  container: HTMLElement;
  onAnchorChange: (anchorSce: HTMLElement) => void;
};
/**
 * folder 또는 section의 기준이 되는 엘리먼트(anchor)를 관찰한다.
 */
const registerAnchorObserver = ({ container, onAnchorChange }: RegisterAnchorObserverArgs): () => void => {
  const onIntersect = (entries: IntersectionObserverEntry[]) => {
    for (const entry of entries) {
      const el = entry.target as HTMLElement;
      /**
       * left값이 음수라면 이전 페이지에서 overflow된 text이다. 이런 경우는 ahchor로 사용하지 않고,
       * 시작부분이 현재 page에 존재하는 경우만 anchor로 사용한다.
       */
      if (entry.isIntersecting && entry.boundingClientRect.left > 0) {
        onAnchorChange(el);
        break;
      }
    }
  };

  /**
   * MutationObserver를 통해서, ScrollContainer에 변경이 발생하면 IntersectionObserver를 재등록한다.
   */
  const intersectionObserver = new IntersectionObserver(onIntersect, {
    root: container,
    threshold: [0]
  });
  const observer = new MutationObserver(() => {
    setTimeout(() => {
      intersectionObserver.disconnect();
      // 모든 섹션 관찰 시작
      let i = 0;
      // console.log(container.querySelectorAll(`.${SECTION_CONTENT_WRAPPER_CLASS_NAME} .${CN_SECTION_CONTENT_ELEMENT}`))
      container.querySelectorAll(FOLDER_ELEMENT_SELECTOR)
        .forEach((el) => {
          i++;
          intersectionObserver.observe(el);
        });
      container.querySelectorAll(SECTION_ELEMENT_SELECTOR)
        .forEach((el) => {
          i++;
          intersectionObserver.observe(el);
        });
      // console.log("[Intersection Observing]", i);
    }, 0);
  });
  observer.observe(container, {
    childList: true,
  });

  return () => {
    intersectionObserver.disconnect();
    observer.disconnect();
  };
};

type TocNodeInfo = {
  tocNodeType: ReadableTocNodeType;
  tocNodeId: string;
};

const extractTocNodeInfo = (el: HTMLElement): TocNodeInfo => {
  const folderId = el.getAttribute(DATA_TOC_FOLDER_ID);
  const sectionId = el.getAttribute(DATA_TOC_SECTION_ID);

  // 두 id가 모두 없으면 에러
  if (!folderId && !sectionId) {
    throw new Error("No toc node id");
  }
  return {
    tocNodeType: folderId ? "FOLDER" : "SECTION",
    tocNodeId: folderId || sectionId || "",
  };
};

const extractReadingBookmark = (el: HTMLElement): ReadingBookmark => {
  const { tocNodeType, tocNodeId } = extractTocNodeInfo(el);

  // FOLDER
  if (tocNodeType === "FOLDER") {
    return {
      tocNodeType,
      tocNodeId,
      sceId: 0,
    }
  }
  // SECTION
  else {
    const sceId = el.getAttribute(DATA_SECTION_CONTENT_ELEMENT_ID);
    if (!sceId) {
      throw new Error("No section content element id");
    }
    return {
      tocNodeType,
      tocNodeId,
      sceId: Number(sceId),
    }
  }
}

/**
 * tocNode들이 container와 겹치는 순간들을 추적하여 Bookmark를 추적하고 저장한다.
 */
export const useTraceReadingBookmark = () => {
  const containerRef = useScrollContainerContext();
  const { id: bookId } = useBookContext();

  /**
   * anchorSce가 변경되면 이로부터 Bookmark를 추출하여 저장한다.
   */
  const saveReadingBookmark = useCallback(async (anchorSce: HTMLElement) => {
    const readingBookmark = extractReadingBookmark(anchorSce);
    await saveReadingBookmarkApi({
      bookId,
      readingBookmark
    })
  }, [bookId]);

  /**
   * IntersectionObserver를 통해서 Bookmark를 저장한다.
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const cleanup = registerAnchorObserver({
      container,
      onAnchorChange: (anchorSce) => {
        // 복원로직이 수행된 이후에만 북마크 추적을 시작
        if (!readingBookmarkStore.getState().isRestored) return;
        saveReadingBookmark(anchorSce);
      }
    });
    return () => {
      cleanup();
    };
  }, [containerRef, saveReadingBookmark]);
}

type BookmarkRestorationStatus = "not-restored" | "reading-unit-rendering" | "restored";

const findBookmarkedElement = (container: HTMLElement, bookmark: ReadingBookmark): HTMLElement | null => {
  let selector: string;
  if (bookmark.tocNodeType === "FOLDER") {
    selector = `.${FOLDER_CONTENT_WRAPPER_CLASS_NAME}[${DATA_TOC_FOLDER_ID}="${bookmark.tocNodeId}"]`;
  }
  else {
    const wrapperSelector = `.${SECTION_CONTENT_WRAPPER_CLASS_NAME}[${DATA_TOC_SECTION_ID}="${bookmark.tocNodeId}"]`;
    selector = `${wrapperSelector} .${CN_SECTION_CONTENT_ELEMENT}[${DATA_SECTION_CONTENT_ELEMENT_ID}="${bookmark.sceId}"]`;
  }
  const el = container.querySelector(selector);
  return el as HTMLElement;
}

/**
 * bookmark에 해당하는 ReadingUnit을 찾는다.
 */
const findReadingUnitByBookmark = (sequence: ReadaingUnitSequence, bookmark: ReadingBookmark) => {
  const match = (node: ReadableTocNode) => node.id === bookmark.tocNodeId;
  for (const unit of sequence) {
    if (match(unit.headNode)) {
      return unit;
    }
    for (const tail of unit.tailNodes) {
      if (match(tail)) {
        return unit;
      }
    }
  }
  return null;
}

/**
 * bookmark로 지정된 element가 보일 수 있는 page를 계산한다.
 * 만약 bookmark로 찾을 수 있는 element가 존재하지 않는 경우 -1을 반환한다.
 */
const getPageByBookmark = (bookmark: ReadingBookmark, pageMeasurement: PageMeasurement, container: HTMLElement): number => {
  const el = findBookmarkedElement(container, bookmark);
  if (!el) return -1;
  const rect = el.getBoundingClientRect();
  for (let i = 1; i <= pageMeasurement.totalPageCount; i++) { // 맨 처음 경계는 볼 필요 없고, 뒤쪽 경계들만 체크하면 됨.
    const boundScrollLeft = pageMeasurement.pageBreakPointCommonDifference * i;
    if (rect.left < boundScrollLeft) {
      return i - 1;
    }
  }
  throw new Error("Bookmark Element가 속해있는 페이지를 찾을 수 없습니다.");
}

/**
 * 저장된 북마크를 복원해낸다.
 */
export const useRestoreReadingBookmark = () => {
  const { id: bookId } = useBookContext();
  const containerRef = useScrollContainerContext();
  const { goToPageAt } = usePageControl();
  const sequence = useReadingUnitStore(s => s.sequence);
  const { readUnit } = useReadingUnitExplorer();

  const restorationStatusRef = useRef<BookmarkRestorationStatus>("not-restored");
  const bookmarkCacheRef = useRef<ReadingBookmark | null>(null);

  /**
   * pageMeasurement가 재측정될 때마다, restorationStatus를 검사하여 필요하다면 북마크 복원 로직을 시작한다.
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const cleanup = registerPageMeasurementListener(async () => {
      const status = restorationStatusRef.current;

      // 북마크에 맞는 readingUnit을 찾아서 상태변경 -> 렌더링 트리거
      if (status === "not-restored") {
        // 북마크 로딩 후 캐싱
        const bookmark = await getReadingBookmarkApi(bookId);
        bookmarkCacheRef.current = bookmark;
        if (bookmark === null) return;
        const unit = findReadingUnitByBookmark(sequence, bookmark);
        if (!unit) throw new Error("북마크의 정보와 매칭되는 unit이 없습니다.");
        readUnit(unit);
        restorationStatusRef.current = "reading-unit-rendering";
      }
      // 북마크 렌더링이 끝난 후라면 구체적인 page 정보에 맞게 scroll을 조정
      if (status === "reading-unit-rendering") {
        requestAnimationFrame(() => {
          const bookmark = bookmarkCacheRef.current;
          if (!bookmark) return;
          const newPage = getPageByBookmark(bookmark, usePageMeasurementStore.getState(), container);
          if (newPage !== -1) {
            goToPageAt(newPage);
            restorationStatusRef.current = "restored"
            readingBookmarkStore.getState().flagBookmarkRestored();
          }
        });
      }
    });

    return () => cleanup();
  }, [bookId, containerRef, goToPageAt, readUnit, sequence]);
}



