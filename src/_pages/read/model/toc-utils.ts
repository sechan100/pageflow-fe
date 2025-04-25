import { ReadableToc, ReadableTocFolder, ReadableTocNode, ReadableTocSection, isReadableTocFolder, isReadableTocSection } from '@/entities/book';


const findNode = (children: ReadableTocNode[], nodeId: string): ReadableTocNode | null => {
  for (const node of children) {
    if (node.id === nodeId) {
      return node;
    }

    if (isReadableTocFolder(node)) {
      const found = findNode(node.children, nodeId);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

const findParent = (parent: ReadableTocFolder, nodeId: string): ReadableTocFolder | null => {
  for (let i = 0; i < parent.children.length; i++) {
    const child = parent.children[i];
    if (child.id === nodeId) {
      return parent;
    }

    if (isReadableTocFolder(child)) {
      const found = findParent(child, nodeId);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

export const TocUtils = {

  findNode: (toc: ReadableToc, nodeId: string): ReadableTocNode => {
    if (nodeId === toc.root.id) {
      return toc.root;
    }
    const found = findNode(toc.root.children, nodeId);
    if (found) {
      return found;
    } else {
      throw new Error(`Node not found: ${nodeId}`);
    }
  },

  findFolder: (toc: ReadableToc, folderId: string): ReadableTocFolder => {
    if (folderId === toc.root.id) {
      return toc.root;
    }
    const found = findNode(toc.root.children, folderId);
    if (isReadableTocFolder(found)) {
      return found;
    } else {
      throw new Error(`Folder not found: ${folderId}`);
    }
  },

  findSection: (toc: ReadableToc, sectionId: string): ReadableTocSection => {
    const found = findNode(toc.root.children, sectionId);
    if (isReadableTocSection(found)) {
      return found;
    } else {
      throw new Error(`Section not found: ${sectionId}`);
    }
  },

  findParent: (toc: ReadableToc, nodeId: string): ReadableTocFolder => {
    const found = findParent(toc.root, nodeId);
    if (found) {
      return found;
    } else {
      throw new Error(`Parent not found: ${nodeId}`);
    }
  },
}