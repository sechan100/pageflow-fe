import mitt from "mitt";

/**
 * 현재 페이지 위치가 변경된 경우에 발생
 */
export type PageChangedEvent = {
  currentPage: number;
  totalPageCount: number;
}

/**
 * 전체 페이지 개수가 변경된 경우에 발생하는 이벤트
 */
export type TotalPageCountChangedEvent = {
  currentPage: number;
  totalPageCount: number;
}

/**
 * 페이지가 처음이나 마지막 경계에서 그 경계 바깥쪽으로 한번 더 이동한 경우 발생하는 이벤트
 */
export type PageOverflowEvent = {
  edge: "start" | "end";
}


type ReaderEvents = {
  "page-changed": {
    currentPage: number;
    totalPageCount: number;
  }
  "total-page-count-changed": {
    currentPage: number;
    totalPageCount: number;
  }
  "page-overflow": {
    edge: "start" | "end";
  }
}

export const readerEvent = mitt<ReaderEvents>();