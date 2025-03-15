import { produce } from "immer";
import { IndicatorMode } from "../../ui/Indicator";
import { TocOperations } from "../toc-operations";
import { Toc, TocFolder } from "../toc.type";
import { extractTocNodeDndData, TocFolderDndData } from "./dnd-data";
import { DndOperation, DndOperationContext } from "./dnd-operation";
import { RectUtils } from "./rect-utils";

/**
 * active를 over 바로 뒤에 삽입하는 operation
 */
export class InsertBelowOperation implements DndOperation {

  /**
   * over 노드의 타입 또는 상태를 확인한다.
   * 1. over가 section
   * 2. over가 closed되어있거나 children이 없는 folder
   * 
   * 위 조건이 적절한 경우, dest를 3등분하여 active가 아랫부분에 over중이라면 수행한다.
   */
  isAcceptable({ active, over }: DndOperationContext): boolean {
    if(active.id === over.id) return false;
    const activeRect = active.rect.current.translated;
    if(!activeRect) return false;

    // over의 상태 확인
    const data = extractTocNodeDndData(over);
    if(data.type === "folder"){
      const { node, isOpen } = data as TocFolderDndData;
      const folder = node as TocFolder;
      if(isOpen && folder.children.length > 0) return false;
    }

    // rect 계산
    const splitedRect = RectUtils.splitRectToThreeHorizontally(over.rect);
    return RectUtils.isRectCenterVerticallyInBoundary(activeRect, splitedRect.bottom);
  }

  getIndicatorMode({ overDepth }: DndOperationContext): IndicatorMode {
    return {
      mode: "line",
      depth: overDepth,
      position: "bottom"
    }
  }

  resolve({ active, over, toc }: DndOperationContext): Toc {
    const overNodeData = extractTocNodeDndData(over);
    const activeNodeData = extractTocNodeDndData(active);
    return produce(toc, draft => {
      const { parent, index } = TocOperations.findParent(draft, overNodeData.id);
      const activeNode = TocOperations.findNode(draft, activeNodeData.id);
      parent.children.splice(index + 1, 0, activeNode);
    })
  }
}