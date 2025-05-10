import { useEffect } from "react";
import { useBookContext } from "../../stores/book-context";
import { ReadingBookmark, useBookmarkStore } from "../../stores/bookmark-store";
import { useReadingUnitStore } from "../../stores/reading-unit-store";
import { CN_SECTION_CONTENT_ELEMENT, DATA_SECTION_CONTENT_ELEMENT_ID, DATA_TOC_FOLDER_ID, DATA_TOC_SECTION_ID } from "./node-element";
import { usePageControl } from "./page-control";
import { PageMeasurement, registerPageMeasurementListener, usePageMeasurementStore } from "./page-measurement";
import { FOLDER_CONTENT_WRAPPER_CLASS_NAME, SECTION_CONTENT_WRAPPER_CLASS_NAME } from "./readable-content";
import { useScrollContainerContext } from "./scroll-container-context";


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
 * bookmark로 지정된 element가 보일 수 있는 page를 계산한다.
 * 만약 bookmark로 찾을 수 있는 element가 존재하지 않는 경우 -1을 반환한다.
 */
const getPageByBookmark = (bookmark: ReadingBookmark, pageMeasurement: PageMeasurement, container: HTMLElement): number => {
  const el = findBookmarkedElement(container, bookmark);
  if (!el) return -1;
  const rect = el.getBoundingClientRect();
  const rectLeft = rect.left + container.scrollLeft; // container의 scrollLeft를 더해줘야함.
  for (let i = 1; i <= pageMeasurement.totalPageCount; i++) { // 맨 처음 경계는 볼 필요 없고, 뒤쪽 경계들만 체크하면 됨.
    const boundScrollLeft = pageMeasurement.pageBreakPointCommonDifference * i;
    if (rectLeft < boundScrollLeft) {
      return i - 1;
    }
  }
  throw new Error("Bookmark Element가 속해있는 페이지를 찾을 수 없습니다.");
}

/**
 * 저장된 북마크를 복원해낸다.
 */
export const NavigateBookmarkConfig = () => {
  const { id: bookId } = useBookContext();
  const containerRef = useScrollContainerContext();
  const { goToPageAt } = usePageControl();

  /**
   * pageMeasurement가 재측정될 때마다, restorationStatus를 검사하여 필요하다면 북마크 복원 로직을 시작한다.
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 북마크 렌더링이 끝난 후에 구체적인 page 정보에 맞게 scroll을 조정
    const tryAdjustPage = async () => {
      const { setNavigatingStatus, navigatingStatus, bookmark } = useBookmarkStore.getState();
      if (bookmark === null) return;
      if (navigatingStatus === "unit-rendering") {
        const newPage = getPageByBookmark(bookmark, usePageMeasurementStore.getState(), container);
        if (newPage !== -1) {
          goToPageAt(newPage);
          setNavigatingStatus("navigated");
        }
      }
    }

    // 북마크에 맞는 readingUnit을 찾아서 상태변경 -> 렌더링 트리거
    useBookmarkStore.subscribe(({ bookmark, navigatingStatus, setNavigatingStatus }) => {
      const { readUnit, findUnitContainingNode } = useReadingUnitStore.getState();
      const currentUnitOrNull = useReadingUnitStore.getState().readingUnitContent?.readingUnit ?? null;
      if (navigatingStatus === "required") {
        if (bookmark === null) return;
        const newUnit = findUnitContainingNode(bookmark.tocNodeId);
        readUnit(newUnit);
        setNavigatingStatus("unit-rendering");

        // unit이 동일한 경우 아래 registerPageMeasurementListener가 호출되지 않음으로, 여기서 호출해줘야함.
        if (currentUnitOrNull !== null && currentUnitOrNull.headNode.id === newUnit.headNode.id) {
          tryAdjustPage();
        }
      }
    })

    const cleanup = registerPageMeasurementListener(() => {
      requestAnimationFrame(() => {
        tryAdjustPage();
      })
    });
    return () => cleanup();
  }, [bookId, containerRef, goToPageAt]);

  return <></>
}



