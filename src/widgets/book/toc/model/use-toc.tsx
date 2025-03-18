import { createStoreContext } from "@/shared/zustand/create-store-context";
import { defaultFolderOpen } from "../config";
import { Toc, TocFolder, TocNode, TocSection } from "../model/toc.type";
import { TocOperations } from "./toc-operations";


type TocStore = {
  toc: Toc;
  setToc: (toc: Toc) => void;
  findNode: (nodeId: string) => TocNode;
  findFolder: (folderId: string) => TocFolder;
  findSection: (sectionId: string) => TocSection;

  /**
   * 전역적으로 folder들의 open 상태를 관리한다. map 객체 자체를 변경하는 동작은 expendAllFolders, collapseAllFolders이다.
   * 기본적으로 folder들 개별로 open 상태를 관리하며, syncFolderOpenState를 통해 공용 상태에 업데이트하여 전역적으로 저장한다.
   */
  folderOpenRegistry: Map<string, boolean>;
  syncFolderOpenState: (folderId: string, isOpen: boolean) => void;
  expendAllFolders: () => void;
  collapseAllFolders: () => void;
}

export const [UseTocStoreProvider, useTocStore] = createStoreContext<Toc, TocStore>((toc, set, get) => ({
  toc,

  setToc: (toc) => set({ toc }),

  findNode: (nodeId) => TocOperations.findNode(toc, nodeId),

  findFolder: (folderId) => TocOperations.findFolder(toc, folderId),

  findSection: (sectionId) => TocOperations.findSection(toc, sectionId),

  folderOpenRegistry: TocOperations.toMapWith(toc, (node) => node.type === "folder", () => defaultFolderOpen),

  syncFolderOpenState: (folderId, isOpen) => {
    get().folderOpenRegistry.set(folderId, isOpen);
  },

  expendAllFolders: () => {
    const newRegistry = new Map();
    get().folderOpenRegistry.keys().forEach(folderId => {
      newRegistry.set(folderId, true);
    });
    set({ folderOpenRegistry: newRegistry });
  },

  collapseAllFolders: () => {
    const newRegistry = new Map();
    get().folderOpenRegistry.keys().forEach(folderId => {
      newRegistry.set(folderId, false);
    });
    set({ folderOpenRegistry: newRegistry });
  }
}));
