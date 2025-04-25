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


type PageChangedEvent = {
  page: number;
  totalPages: number;
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

const register = (event: string, callback: any) => {
  readerEventEmitter.on(event, callback);
  return () => readerEventEmitter.off(event, callback);
}