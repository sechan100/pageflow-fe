import { createStoreContext } from "@/shared/zustand/create-store-context";
import { Toc, TocFolder, TocNode, TocSection } from "../model/toc.type";
import { tocOperations } from "./toc-operations";


type UseToc = {
  toc: Toc;
  findNode: (nodeId: string) => TocNode;
  findFolder: (folderId: string) => TocFolder;
  findSection: (sectionId: string) => TocSection;
  toggleFolder: (folderId: string) => void;
  expendAllFolders: () => void;
  collapseAllFolders: () => void;
}

export const [UseTocProvider, useToc] = createStoreContext<Toc, UseToc>((toc, set, get) => ({
  toc,
  findNode: (nodeId) => tocOperations.findNode(toc, nodeId),
  findFolder: (folderId) => tocOperations.findFolder(toc, folderId),
  findSection: (sectionId) => tocOperations.findSection(toc, sectionId),
  toggleFolder: (folderId) => set({ toc: tocOperations.toggleFolder(get().toc, folderId) }),
  expendAllFolders: () => set({ toc: tocOperations.expendAllFolders(get().toc) }),
  collapseAllFolders: () => set({ toc: tocOperations.collapseAllFolders(get().toc) }),
}));
