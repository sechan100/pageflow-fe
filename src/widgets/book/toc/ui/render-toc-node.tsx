import { NodeTypeGuard, TocNode } from "../model/toc.type";
import { FolderNode } from "./FolderNode";
import { SectionNode } from "./SectionNode";


// 재귀적으로 TOC 노드를 렌더링하는 함수
export const renderTocNode = (node: TocNode, depth = 0) => {
  if (NodeTypeGuard.isFolder(node)) {
    return (
      <FolderNode
        key={node.id}
        folder={node}
        depth={depth}
      />
    )
  } else if (NodeTypeGuard.isSection(node)) {
    return (
      <SectionNode
        key={node.id}
        section={node}
        depth={depth}
      />
    )
  } else {
    throw new Error(`Unknown node type: ${node.type}`);
  }
};