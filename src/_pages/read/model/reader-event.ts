import mitt from "mitt";


type ReaderEvent = "content-rendered";

const readerEventEmitter = mitt();


export const registerReaderEventListener = (event: ReaderEvent, callback: () => void) => {
  readerEventEmitter.on(event, callback);
  return () => readerEventEmitter.off(event, callback);
}

export const emitReaderEvent = (event: ReaderEvent) => {
  readerEventEmitter.emit(event);
}