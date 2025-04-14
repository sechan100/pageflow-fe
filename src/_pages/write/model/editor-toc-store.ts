import { EditorToc, EditorTocStore, TocOperations, defaultFolderOpen } from "@/entities/editor";
import { createStoreContext } from "@/shared/zustand/create-store-context";

const [EditorTocStoreContextProvider, useEditorTocStore] = createStoreContext<EditorToc, EditorTocStore>((initialToc, set, get) => ({
  toc: initialToc,

  setToc: (toc) => set({ toc }),

  folderOpenRegistry: TocOperations.toMapWith(initialToc, (node) => node.type === "FOLDER", () => defaultFolderOpen),

  setFolderOpen: (folderId, isOpen) => {
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

export { EditorTocStoreContextProvider, useEditorTocStore };
