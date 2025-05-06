import { ReadableTocNodeType } from "@/entities/book";
import { useCallback, useEffect } from "react";
import { getReadingBookmarkApi, saveReadingBookmarkApi } from "../api/reading-bookmark";
import { CN_SECTION_CONTENT_ELEMENT, DATA_SECTION_CONTENT_ELEMENT_ID, DATA_TOC_FOLDER_ID, DATA_TOC_SECTION_ID } from "../config/node-element";
import { FOLDER_CONTENT_WRAPPER_CLASS_NAME, SECTION_CONTENT_WRAPPER_CLASS_NAME } from "../config/readable-content";
import { useBookContext } from "./context/book-context";
import { getScrollContainerElement } from "./page-measurement";


type ReadingBookmark = {
  tocNodeType: ReadableTocNodeType;
  tocNodeId: string;
  /**
   * 0부터 시작하는 section content element들의 번호
   */
  sceId: number;
}


const FOLDER_ELEMENT_SELECTOR = `.${FOLDER_CONTENT_WRAPPER_CLASS_NAME}`;
const SECTION_ELEMENT_SELECTOR = `.${SECTION_CONTENT_WRAPPER_CLASS_NAME} .${CN_SECTION_CONTENT_ELEMENT}`;


type RegisterAnchorObserverArgs = {
  container: HTMLElement;
  onAnchorChange: (anchorSCE: HTMLElement) => void;
};
/**
 * folder 또는 section의 기준이 되는 엘리먼트(anchor)를 관찰한다.
 */
const registerAnchorObserver = ({ container, onAnchorChange }: RegisterAnchorObserverArgs): () => void => {
  const onIntersect = (entries: IntersectionObserverEntry[]) => {
    for (const entry of entries) {
      const el = entry.target as HTMLElement;
      if (entry.isIntersecting) {
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

const isOnBookmarkedPage = () => {

}

/**
 * 
 */
const resolveReadingBookmark = () => {

}

const useReadingBookmark = () => {
  const { id: bookId } = useBookContext();
  const onAnchorChange = useCallback(async (anchorSce: HTMLElement) => {
    const readingBookmark = extractReadingBookmark(anchorSce);
    await saveReadingBookmarkApi({
      bookId,
      readingBookmark
    })
    console.log(await getReadingBookmarkApi(bookId))
  }, [bookId]);

  useEffect(() => {
    const el = getScrollContainerElement();
    if (!el) return;
    const cleanup = registerAnchorObserver({
      container: el,
      onAnchorChange
    });
    return () => {
      cleanup();
    };
  }, [onAnchorChange]);
};



export {
  useReadingBookmark
};
export type {
  ReadingBookmark
};

