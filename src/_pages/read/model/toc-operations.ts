import { ReadableToc, ReadableTocFolder, ReadableTocNode, ReadableTocSection, isReadableTocFolder, isReadableTocSection } from '@/entities/book';


const findNodeRecursive = (children: ReadableTocNode[], nodeId: string): ReadableTocNode | null => {
  for (const node of children) {
    if (node.id === nodeId) {
      return node;
    }

    if (isReadableTocFolder(node)) {
      const found = findNodeRecursive(node.children, nodeId);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

const findParentRecursive = (parent: ReadableTocFolder, nodeId: string): ReadableTocFolder | null => {
  for (let i = 0; i < parent.children.length; i++) {
    const child = parent.children[i];
    if (child.id === nodeId) {
      return parent;
    }

    if (isReadableTocFolder(child)) {
      const found = findParentRecursive(child, nodeId);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

const cache = new Map<string, ReadableTocNode>();
const parentCache = new Map<string, ReadableTocFolder>();

export const TocOperations = {
  findNode: (toc: ReadableToc, nodeId: string): ReadableTocNode => {
    if (cache.has(nodeId)) {
      return cache.get(nodeId)!;
    }
    if (nodeId === toc.root.id) {
      return toc.root;
    }
    const found = findNodeRecursive(toc.root.children, nodeId);
    if (found) {
      cache.set(nodeId, found);
      return found;
    } else {
      throw new Error(`Node not found: ${nodeId}`);
    }
  },

  findFolder: (toc: ReadableToc, folderId: string): ReadableTocFolder => {
    if (folderId === toc.root.id) {
      return toc.root;
    }
    const found = findNodeRecursive(toc.root.children, folderId);
    if (isReadableTocFolder(found)) {
      return found;
    } else {
      throw new Error(`Folder not found: ${folderId}`);
    }
  },

  findSection: (toc: ReadableToc, sectionId: string): ReadableTocSection => {
    const found = findNodeRecursive(toc.root.children, sectionId);
    if (isReadableTocSection(found)) {
      return found;
    } else {
      throw new Error(`Section not found: ${sectionId}`);
    }
  },

  findParent: (toc: ReadableToc, nodeId: string): ReadableTocFolder => {
    if (parentCache.has(nodeId)) {
      return parentCache.get(nodeId)!;
    }
    const found = findParentRecursive(toc.root, nodeId);
    if (found) {
      parentCache.set(nodeId, found);
      return found;
    } else {
      throw new Error(`Parent not found: ${nodeId}`);
    }
  },

  isRootFolder: (toc: ReadableToc, folderId: string): boolean => {
    return toc.root.id === folderId;
  },

  findRightMostNode: (folder: ReadableTocFolder): ReadableTocNode => {
    let rightMostNode: ReadableTocNode = folder;
    while (isReadableTocFolder(rightMostNode) && rightMostNode.children.length > 0) {
      const lastChild = rightMostNode.children[rightMostNode.children.length - 1];
      if (isReadableTocFolder(lastChild)) {
        rightMostNode = lastChild;
      } else {
        break;
      }
    }
    return rightMostNode;
  },
}