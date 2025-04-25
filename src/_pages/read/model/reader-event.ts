import mitt from "mitt";


const readerEventEmitter = mitt();

export const contentRenderedEvent = {
  name: "content-rendered" as const,
  registerListener: (callback: () => void) => {
    return register(contentRenderedEvent.name, callback);
  },
  emit: () => {
    readerEventEmitter.emit(contentRenderedEvent.name);
  }
}


/**
 * 현재 페이지 위치가 변경된 경우에 발생하는 이벤트
 */
type PageChangedEvent = {
  currentPage: number;
  totalPageCount: number;
}
export const pageChangedEvent = {
  name: "page-changed" as const,
  registerListener: (callback: (data: PageChangedEvent) => void) => {
    return register(pageChangedEvent.name, callback);
  },
  emit: (data: PageChangedEvent) => {
    readerEventEmitter.emit(pageChangedEvent.name, data);
  }
}

/**
 * 전체 페이지 개수가 변경된 경우에 발생하는 이벤트
 */
type TotalPageCountChangedEvent = {
  currentPage: number;
  totalPageCount: number;
}
export const totalPageCountChangedEvent = {
  name: "total-page-count-changed" as const,
  registerListener: (callback: (data: TotalPageCountChangedEvent) => void) => {
    return register(totalPageCountChangedEvent.name, callback);
  },
  emit: (data: TotalPageCountChangedEvent) => {
    readerEventEmitter.emit(totalPageCountChangedEvent.name, data);
  }
}

/**
 * 페이지가 처음이나 마지막 경계에서 그 경계 바깥쪽으로 한번 더 이동한 경우 발생하는 이벤트
 */
type PageOverflowEvent = {
  edge: "start" | "end";
}
export const pageOverflowEvent = {
  name: "page-overflow" as const,
  registerListener: (callback: (data: PageOverflowEvent) => void) => {
    return register(pageOverflowEvent.name, callback);
  },
  emit: (data: PageOverflowEvent) => {
    readerEventEmitter.emit(pageOverflowEvent.name, data);
  }
}

/**
 * readableUnit이 최초 세팅되거나 변경된 경우에 발생
 */
export const readableUnitChangedEvent = {
  name: "readable-unit-changed" as const,
  registerListener: (callback: () => void) => {
    return register(readableUnitChangedEvent.name, callback);
  },
  emit: () => {
    readerEventEmitter.emit(readableUnitChangedEvent.name);
  }
}

const register = (event: string, callback: any) => {
  readerEventEmitter.on(event, callback);
  return () => readerEventEmitter.off(event, callback);
}