import { EditorToc, EditorTocFolder, EditorTocNode, EditorTocSection, isEditorTocFolder, isEditorTocSection } from "./toc";


const findNode = (children: EditorTocNode[], nodeId: string): EditorTocNode | null => {
  for (const node of children) {
    if (node.id === nodeId) {
      return node;
    }

    if (isEditorTocFolder(node)) {
      const found = findNode(node.children, nodeId);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

const mutateAllFolder = (children: EditorTocNode[], mutate: (folder: EditorTocFolder) => void): EditorTocNode[] => {
  return children.map(child => {
    const newChild = { ...child };
    if (isEditorTocFolder(newChild)) {
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

const findParent = (parent: EditorTocFolder, nodeId: string): EditorTocFolder | null => {
  for (let i = 0; i < parent.children.length; i++) {
    const child = parent.children[i];
    if (child.id === nodeId) {
      return parent;
    }

    if (isEditorTocFolder(child)) {
      const found = findParent(child, nodeId);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

export const TocOperations = {

  findNode: (toc: EditorToc, nodeId: string): EditorTocNode => {
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

  findFolder: (toc: EditorToc, folderId: string): EditorTocFolder => {
    if (folderId === toc.root.id) {
      return toc.root;
    }
    const found = findNode(toc.root.children, folderId);
    if (isEditorTocFolder(found)) {
      return found;
    } else {
      throw new Error(`Folder not found: ${folderId}`);
    }
  },

  findSection: (toc: EditorToc, sectionId: string): EditorTocSection => {
    const found = findNode(toc.root.children, sectionId);
    if (isEditorTocSection(found)) {
      return found;
    } else {
      throw new Error(`Section not found: ${sectionId}`);
    }
  },

  findParent: (toc: EditorToc, nodeId: string): EditorTocFolder => {
    const found = findParent(toc.root, nodeId);
    if (found) {
      return found;
    } else {
      throw new Error(`Parent not found: ${nodeId}`);
    }
  },

  removeNodeMutable: (toc: EditorToc, nodeId: string): EditorTocNode => {
    const newRoot = { ...toc.root };
    const found = findParent(newRoot, nodeId);
    if (found) {
      const index = found.children.findIndex(child => child.id === nodeId);
      const removed = found.children.splice(index, 1)[0];
      return removed;
    } else {
      throw new Error(`Node not found: ${nodeId}`);
    }
  },

  // root를 제외한 모든 노드를 순회하며 map을 만든다.
  toMap: (toc: EditorToc): Map<string, EditorTocNode> => {
    const map = new Map<string, EditorTocNode>();
    const traverse = (node: EditorTocNode) => {
      map.set(node.id, node);
      if (isEditorTocFolder(node)) {
        node.children.forEach(traverse);
      }
    }
    toc.root.children.forEach(traverse);
    return map;
  },

  toMapWith: <T>(toc: EditorToc, filter: (node: EditorTocNode) => boolean, mapFn: (node: EditorTocNode) => T): Map<string, T> => {
    const map = new Map<string, T>();
    const traverse = (node: EditorTocNode) => {
      if (filter(node)) {
        map.set(node.id, mapFn(node));
      }
      if (isEditorTocFolder(node)) {
        node.children.forEach(traverse);
      }
    }
    toc.root.children.forEach(traverse);
    return map;
  }
}