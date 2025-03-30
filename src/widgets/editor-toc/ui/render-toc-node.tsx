import { NodeTypeGuard, TocNode } from '@/entities/book';
import { DndTocFolder } from "./DndTocFolder";
import { DndTocSection } from "./DndTocSection";


// 재귀적으로 TOC 노드를 렌더링하는 함수
export const renderTocNode = (node: TocNode, depth = 0) => {
  if (NodeTypeGuard.isFolder(node)) {
    return (
      <DndTocFolder
        key={node.id}
        folder={node}
        depth={depth}
      />
    )
  } else if (NodeTypeGuard.isSection(node)) {
    return (
      <DndTocSection
        key={node.id}
        section={node}
        depth={depth}
      />
    )
  } else {
    throw new Error(`Unknown node type: ${node.type}`);
  }
};