import { EditorTocNode, isEditorTocFolder, isEditorTocSection } from "@/entities/editor";
import { DndTocFolder } from "./DndTocFolder";
import { DndTocSection } from "./DndTocSection";


// 재귀적으로 TOC 노드를 렌더링하는 함수
export const renderTocNode = (node: EditorTocNode, depth = 0) => {
  if (isEditorTocFolder(node)) {
    return (
      <DndTocFolder
        key={node.id}
        folder={node}
        depth={depth}
      />
    )
  } else if (isEditorTocSection(node)) {
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