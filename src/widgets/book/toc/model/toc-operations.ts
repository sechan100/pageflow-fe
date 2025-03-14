import { SvNodeTypeGuard } from "@/entities/book";
import { produce } from "immer";
import { NodeTypeGuard, Toc, TocFolder, TocNode, TocSection } from "./toc.type";


const findNode = (children: TocNode[], nodeId: string): TocNode | null => {
  for(const node of children) {
    if(node.id === nodeId) {
      return node;
    }

    if(SvNodeTypeGuard.isSvFolder(node)) {
      const found = findNode(node.children, nodeId);
      if(found) {
        return found;
      }
    }
  }
  return null;
}

const mutateAllFolder = (children: TocNode[], mutate: (folder: TocFolder) => void): TocNode[] => {
  return children.map(child => {
    const newChild = { ...child };
    if(NodeTypeGuard.isFolder(newChild)) {
      mutate(newChild);
      return {
        ...newChild,
        children: mutateAllFolder(newChild.children, mutate)
      };
    } else {
      return newChild;
    }
  });
}

export const tocOperations = {

  findNode: (toc: Toc, nodeId: string): TocNode => {
    const found = findNode(toc.root.children, nodeId);
    if(found) {
      return found;
    } else {
      throw new Error(`Node not found: ${nodeId}`);
    }
  },

  findFolder: (toc: Toc, folderId: string): TocFolder => {
    const found = findNode(toc.root.children, folderId);
    if(NodeTypeGuard.isFolder(found)) {
      return found;
    } else {
      throw new Error(`Folder not found: ${folderId}`);
    }
  },

  findSection: (toc: Toc, sectionId: string): TocSection => {
    const found = findNode(toc.root.children, sectionId);
    if(NodeTypeGuard.isSection(found)) {
      return found;
    } else {
      throw new Error(`Section not found: ${sectionId}`);
    }
  },

  toggleFolder: (toc: Toc, folderId: string): Toc => {
    return produce(toc, draft => {
      const folder = tocOperations.findFolder(draft, folderId);
      folder.isOpen = !folder.isOpen;
    });
  },

  expendAllFolders: (toc: Toc): Toc => {
    return {
      ...toc,
      root: {
        ...toc.root,
        children: mutateAllFolder(toc.root.children, folder => folder.isOpen = true)
      }
    }
  },

  collapseAllFolders: (toc: Toc): Toc => {
    return {
      ...toc,
      root: {
        ...toc.root,
        children: mutateAllFolder(toc.root.children, folder => folder.isOpen = false)
      }
    }
  }
}