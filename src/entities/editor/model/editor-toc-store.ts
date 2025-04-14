import { createStoreContext } from "@/shared/zustand/create-store-context";
import { defaultFolderOpen } from '../config/default-folder-open';
import { EditorToc } from "./toc";
import { TocOperations } from "./toc-operations";


export type EditorTocStore = {
  toc: EditorToc;
  setToc: (toc: EditorToc) => void;
  /**
   * 전역적으로 folder들의 open 상태를 관리한다. map 객체 자체를 변경하는 동작은 expendAllFolders, collapseAllFolders이다.
   * 기본적으로 folder들 개별로 open 상태를 관리하며, setFolderOpen을 통해 공용 상태에 업데이트하여 전역적으로 저장한다.
   */
  folderOpenRegistry: Map<string, boolean>;
  setFolderOpen: (folderId: string, isOpen: boolean) => void;
  expendAllFolders: () => void;
  collapseAllFolders: () => void;
}