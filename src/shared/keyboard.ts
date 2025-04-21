

type Cleanup = () => void;

type CtrlShortcutArgs = {
  element: HTMLElement;
  /**
   * ctrl + key를 눌렀을 때 cb가 실행된다.
   * @example 's', 'x', 'a', '3' 등
   */
  key: string;
  cb: () => void;
}
export const registerCtrlShortCut = ({
  element,
  key,
  cb
}: CtrlShortcutArgs): Cleanup => {
  const shortcutHandler = async (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === key) {
      e.preventDefault();
      e.stopPropagation();
      cb();
    }
  }
  element.addEventListener("keydown", shortcutHandler)

  return () => {
    element.removeEventListener("keydown", shortcutHandler)
  }
}


type EnterShortCutArgs = {
  element: HTMLElement;
  cb: () => void;
}
export const registerEnterShortCut = ({
  element,
  cb
}: EnterShortCutArgs): Cleanup => {
  const handleEnter = (e: KeyboardEvent) => {
    if (e.isComposing) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      cb();
    }
  }
  element.addEventListener("keydown", handleEnter)

  return () => {
    element.removeEventListener("keydown", handleEnter)
  }
}

type KeyboardShortCutArgs = {
  element: HTMLElement;
  key: string;
  cb: () => void;
}
export const registerKeyboardShortCut = ({
  element,
  key,
  cb
}: KeyboardShortCutArgs): Cleanup => {
  const handleEnter = (e: KeyboardEvent) => {
    if (e.isComposing) return;
    if (e.key === key) {
      e.preventDefault();
      e.stopPropagation();
      cb();
    }
  }
  element.addEventListener("keydown", handleEnter)

  return () => {
    element.removeEventListener("keydown", handleEnter)
  }
}