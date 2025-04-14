import { TocOperations, useCurrentNode } from "@/entities/editor";
import { useCallback, useMemo } from "react";
import { useEditorTocStore } from "./editor-toc-store-context";




/**
 * 새로운 노드를 생성할 때, 부모 노드를 찾는 함수다.
 * 기본적으로 현재 선택중인 노드를 기준으로 그의 부모노드를 찾는다.
 * 현재 노드가 section인데 이걸 기준으로 section을 만들거라면 현재 노드의 부모를 parentNode로 반환한다.
 * 현재 노드가 section인데 이걸 기준으로 folder을 만들거라면 현재 노드의 조부모를 parentNode로 반환한다.
 */
export const useCreateNodeParentResolve = () => {
  const toc = useEditorTocStore(s => s.toc);
  const { nodeId, nodeType } = useCurrentNode();

  // currentNode는 현재 편집중인 node가 없다면 root 노드다.
  const currentNodeId = useMemo(() => {
    if (nodeId === null) {
      return toc.root.id;
    } else {
      return nodeId;
    }
  }, [nodeId, toc])

  const currentNodeType = useMemo(() => {
    if (nodeType === "none") {
      return "root-folder";
    } else {
      return nodeType;
    }
  }, [nodeType]);

  const resolveCreateNodeParentNode = useCallback((createNodeType: "folder" | "section") => {
    if (currentNodeType === "folder") {
      // folder 편집중 생성 -> 현재 folder의 자식으로 추가
      const parentNode = TocOperations.findFolder(toc, currentNodeId);
      return parentNode;
    } else if (currentNodeType === "section") { // 현재 편집중인 노드가 section
      // section 편집중, 생성 -> 현재 편집중인 section의 형제로 추가
      const parentNode = TocOperations.findParent(toc, currentNodeId);
      return parentNode;
    } else if (currentNodeType === "root-folder") {
      return toc.root;
    } else {
      throw new Error("unknown node type");
    }
  }, [currentNodeId, currentNodeType, toc]);

  return {
    resolveCreateNodeParentNode
  }

}