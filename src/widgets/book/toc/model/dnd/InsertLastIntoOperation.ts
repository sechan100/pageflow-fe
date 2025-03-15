import { produce } from "immer";
import { IndicatorMode } from "../../ui/Indicator";
import { TocOperations } from "../toc-operations";
import { Toc } from "../toc.type";
import { extractTocNodeDndData, TocFolderDndData } from "./dnd-data";
import { DndOperation, DndOperationContext } from "./dnd-operation";
import { RectUtils } from "./rect-utils";

/**
 * over가 folder일 때, over의 마지막 자식으로 active를 삽입하는 operation
 */
export class InsertLastIntoOperation implements DndOperation {

  /**
   * over가 folder이면서 closed 상태인 경우,
   * dest를 3등분하여 active가 중앙에 over중이라면 수행한다.
   */
  isAcceptable({ active, over }: DndOperationContext): boolean {
    if(active.id === over.id) return false;
    const activeRect = active.rect.current.translated;
    if(!activeRect) return false;

    // over의 상태 확인
    const data = extractTocNodeDndData(over);
    if(data.type === "folder"){
      const { node, isOpen } = data as TocFolderDndData;
      if(isOpen) return false;
      // rect 계산
      const splitedRect = RectUtils.splitRectToThreeHorizontally(over.rect);
      return RectUtils.isRectCenterVerticallyInBoundary(activeRect, splitedRect.center);
    }
    return false;
  }

  getIndicatorMode({ overDepth }: DndOperationContext): IndicatorMode {
    return {
      mode: "box",
      depth: overDepth,
    }
  }

  resolve({ active, over, toc }: DndOperationContext): Toc {
    const overNodeData = extractTocNodeDndData(over);
    const activeNodeData = extractTocNodeDndData(active);
    return produce(toc, draft => {
      const parent = TocOperations.findFolder(draft, overNodeData.id);
      const activeNode = TocOperations.findNode(draft, activeNodeData.id);
      parent.children.push(activeNode);
    })
  }
}