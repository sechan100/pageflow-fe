import { ReadableTocNode, ReadableTocNodeType } from "@/entities/book";
import { RefObject, useCallback, useEffect, useRef } from "react";
import { getReadingBookmarkApi, saveReadingBookmarkApi } from "../../api/reading-bookmark";
import { CN_SECTION_CONTENT_ELEMENT, DATA_SECTION_CONTENT_ELEMENT_ID, DATA_TOC_FOLDER_ID, DATA_TOC_SECTION_ID } from "../../config/node-element";
import { FOLDER_CONTENT_WRAPPER_CLASS_NAME, SECTION_CONTENT_WRAPPER_CLASS_NAME } from "../../config/readable-content";
import { ReadaingUnitSequence } from "../../model/reading-unit";
import { useBookContext } from "../book-context";
import { registerPageMeasurementListener } from "./page-measurement";
import { useReadingUnitExplorer, useReadingUnitStore } from "./reading-unit-store";


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

const findBookmarkedElement = (container: HTMLElement, bookmark: ReadingBookmark): HTMLElement | null => {
  let selector: string;
  if (bookmark.tocNodeType === "FOLDER") {
    selector = `.${FOLDER_CONTENT_WRAPPER_CLASS_NAME}[${DATA_TOC_FOLDER_ID}="${bookmark.tocNodeId}"]`;
  }
  else {
    const wrapperSelector = `.${SECTION_CONTENT_WRAPPER_CLASS_NAME}[${DATA_TOC_SECTION_ID}="${bookmark.tocNodeId}"]`;
    selector = `${wrapperSelector} .${CN_SECTION_CONTENT_ELEMENT}[${DATA_SECTION_CONTENT_ELEMENT_ID}="${bookmark.sceId}"]`;
  }
  console.log(selector);
  const el = container.querySelector(selector);
  return el as HTMLElement;
}

/**
 * 현재 북마크된 지점이 container에 보이고있는지 확인한다.
 */
const isOnBookmarkedPage = (container: HTMLElement, bookmark: ReadingBookmark) => {
  if (!container) throw new Error("No scroll container element ref");
  const bookmarkedEl = findBookmarkedElement(container, bookmark);
  console.log(bookmarkedEl);
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
 * tocNode들이 container와 겹치는 순간들을 추적하여 Bookmark를 추적하고 저장한다.
 */
const useTraceReadingBookmark = (containerRef: RefObject<HTMLElement | null>) => {
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
    const el = containerRef.current;
    if (!el) return;
    const cleanup = registerAnchorObserver({
      container: el,
      onAnchorChange: saveReadingBookmark
    });
    return () => {
      cleanup();
    };
  }, [containerRef, saveReadingBookmark]);

}

enum BookmarkRestorationStatus {
  // 북마크를 로드하는 중
  LOADING_BOOKMARK = 0,
  // 북마크 복원 로직을 실행하기 전
  NOT_RESTORED = 1,
  // 북마크 복원 로직 실행 후, readingUnit을 렌더링하는 중
  RENDERING_READING_UNIT = 2,
  // 북마크 복원 로직 실행됨.
  RESTORED = 3,
}

/**
 * 저장된 북마크를 복원해낸다.
 */
const useRestoreReadingBookmark = (containerRef: RefObject<HTMLElement | null>) => {
  const { id: bookId } = useBookContext();
  const sequence = useReadingUnitStore(s => s.sequence);
  const { readUnit } = useReadingUnitExplorer();

  const restorationStatusRef = useRef<BookmarkRestorationStatus>(BookmarkRestorationStatus.LOADING_BOOKMARK);
  const bookmarkRef = useRef<ReadingBookmark | null>(null);

  /**
   * 북마크를 로드한다.
   */
  useEffect(() => {
    if (restorationStatusRef.current !== BookmarkRestorationStatus.LOADING_BOOKMARK) return;
    const fetchBookmark = async () => {
      const bookmark = await getReadingBookmarkApi(bookId);
      bookmarkRef.current = bookmark;
      restorationStatusRef.current++;
    }
    fetchBookmark();
  }, [bookId]);


  /**
   * pageMeasurement가 재측정될 때마다, restorationStatus를 검사하여 필요하다면 북마크 복원 로직을 시작한다.
   */
  useEffect(() => {
    const cleanup = registerPageMeasurementListener(() => {
      const bookmark = bookmarkRef.current;
      if (bookmark === null) return;
      const status = restorationStatusRef.current;

      // 북마크에 맞는 readingUnit을 찾아서 상태변경 -> 렌더링 트리거
      if (status === BookmarkRestorationStatus.NOT_RESTORED) {
        const unit = findReadingUnitByBookmark(sequence, bookmark);
        if (!unit) throw new Error("북마크의 정보와 매칭되는 unit이 없습니다.");
        readUnit(unit);
        restorationStatusRef.current++;
      }
      // 북마크 렌더링이 끝난 후라면 구체적인 page 정보에 맞게 scroll을 조정
      if (status === BookmarkRestorationStatus.RENDERING_READING_UNIT) {

      }
    });

    return () => cleanup();
  }, [bookId, readUnit, sequence]);

  /**
   * 북마크된 페이지가 보이는지 확인하고, 적절하게 Bookmark 위치를 복원한다.
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resolve = async () => {
      const bookmark: ReadingBookmark = {
        tocNodeType: "SECTION",
        tocNodeId: "01ec8bcf-2363-405a-b36f-a016073d56da",
        sceId: 1,
      }
      // const bookmark = await getReadingBookmarkApi(bookId);
      if (!bookmark) return;
      isOnBookmarkedPage(container, bookmark)
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    window.resolveReadingBookmark = resolve;

  }, [bookId, containerRef]);
}


export {
  useRestoreReadingBookmark,
  useTraceReadingBookmark
};
export type {
  ReadingBookmark
};

