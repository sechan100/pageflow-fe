import { NodeTypeGuard, Toc, TocFolder, TocNode, TocSection } from "./toc.type";


const findNode = (children: TocNode[], nodeId: string): TocNode | null => {
  for(const node of children) {
    if(node.id === nodeId) {
      return node;
    }

    if(NodeTypeGuard.isFolder(node)) {
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

const findParent = (parent: TocFolder, nodeId: string): TocFolder | null => {
  for(let i = 0; i < parent.children.length; i++) {
    const child = parent.children[i];
    if(child.id === nodeId) {
      return parent;
    }

    if(NodeTypeGuard.isFolder(child)) {
      const found = findParent(child, nodeId);
      if(found) {
        return found;
      }
    }
  }
  return null;
}

export const TocOperations = {

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

  findParent: (toc: Toc, nodeId: string): TocFolder => {
    const found = findParent(toc.root, nodeId);
    if(found) {
      return found;
    } else {
      throw new Error(`Parent not found: ${nodeId}`);
    }
  },

  removeNodeMutable: (toc: Toc, nodeId: string): TocNode => {
    const newRoot = { ...toc.root };
    const found = findParent(newRoot, nodeId);
    if(found) {
      const index = found.children.findIndex(child => child.id === nodeId);
      const removed = found.children.splice(index, 1)[0];
      return removed;
    } else {
      throw new Error(`Node not found: ${nodeId}`);
    }
  },

  // root를 제외한 모든 노드를 순회하며 map을 만든다.
  toMap: (toc: Toc): Map<string, TocNode> => {
    const map = new Map<string, TocNode>();
    const traverse = (node: TocNode) => {
      map.set(node.id, node);
      if(NodeTypeGuard.isFolder(node)) {
        node.children.forEach(traverse);
      }
    }
    toc.root.children.forEach(traverse);
    return map;
  },

  toMapWith: <T>(toc: Toc, filter: (node: TocNode) => boolean, mapFn: (node: TocNode) => T): Map<string, T> => {
    const map = new Map<string, T>();
    const traverse = (node: TocNode) => {
      if(filter(node)) {
        map.set(node.id, mapFn(node));
      }
      if(NodeTypeGuard.isFolder(node)) {
        node.children.forEach(traverse);
      }
    }
    toc.root.children.forEach(traverse);
    return map;
  }
}