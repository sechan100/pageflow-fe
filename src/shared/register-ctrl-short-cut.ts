

type Cleanup = () => void;

type Args = {
  element: HTMLElement | undefined | null;
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
}: Args): Cleanup => {
  const shortcutHandler = async (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === key) {
      e.preventDefault();
      cb();
    }
  }
  if (!element) return () => { }

  element.addEventListener("keydown", shortcutHandler)
  return () => {
    element.removeEventListener("keydown", shortcutHandler)
  }
}