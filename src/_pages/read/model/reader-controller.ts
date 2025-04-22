import mitt from "mitt";


const emitter = mitt();

const toPrevEvent = "to-prev";
const toNextEvent = "to-next";

export const readerController = {
  registerToPrevListener: (callback: () => void) => {
    emitter.on(toPrevEvent, callback);
    return () => emitter.off(toPrevEvent, callback);
  },
  registerToNextListener: (callback: () => void) => {
    emitter.on(toNextEvent, callback);
    return () => emitter.off(toNextEvent, callback);
  },
  toPrev: () => {
    emitter.emit(toPrevEvent);
  },
  toNext: () => {
    emitter.emit(toNextEvent);
  },
}