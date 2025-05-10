import { ReadableTocNodeType } from "@/entities/book";
import { debounce } from "lodash";
import { useCallback, useEffect } from "react";
import { saveReadingBookmarkApi } from "../../api/reading-bookmark";
import { useBookContext } from "../../stores/book-context";
import { ReadingBookmark, useBookmarkStore } from "../../stores/bookmark-store";
import { CN_SECTION_CONTENT_ELEMENT, DATA_SECTION_CONTENT_ELEMENT_ID, DATA_TOC_FOLDER_ID, DATA_TOC_SECTION_ID } from "./node-element";
import { FOLDER_CONTENT_WRAPPER_CLASS_NAME, SECTION_CONTENT_WRAPPER_CLASS_NAME } from "./readable-content";
import { useScrollContainerContext } from "./scroll-container-context";



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
export const TraceBookmarkConfig = () => {
  const containerRef = useScrollContainerContext();
  const { id: bookId } = useBookContext();

  /**
   * anchorSce가 변경되면 이로부터 Bookmark를 추출하여 저장한다.
   */
  const saveReadingBookmark = useCallback(async (anchorSce: HTMLElement) => {
    const readingBookmark = extractReadingBookmark(anchorSce);
    useBookmarkStore.setState({ bookmark: readingBookmark });
    await saveReadingBookmarkApi({
      bookId,
      readingBookmark
    });
  }, [bookId]);

  /**
   * IntersectionObserver를 통해서 Bookmark를 저장한다.
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const debouncedSaveReadingBookmark = debounce(saveReadingBookmark, 3000);
    const cleanup = registerAnchorObserver({
      container,
      onAnchorChange: (anchorSce) => {
        // 이동로직이 수행된 이후에만 북마크 추적을 시작
        if (useBookmarkStore.getState().navigatingStatus !== "navigated") return;
        debouncedSaveReadingBookmark(anchorSce);
      }
    });
    return () => {
      cleanup();
    };
  }, [containerRef, saveReadingBookmark]);

  return <></>;
}