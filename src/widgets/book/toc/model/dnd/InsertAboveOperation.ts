import { produce } from "immer";
import { IndicatorMode } from "../../ui/Indicator";
import { TocOperations } from "../toc-operations";
import { Toc } from "../toc.type";
import { extractTocNodeDndData } from "./dnd-data";
import { DndOperation, DndOperationContext } from "./dnd-operation";
import { RectUtils } from "./rect-utils";

/**
 * active를 over 바로 위에 삽입하는 operation
 */
export class InsertAboveOperation implements DndOperation {

  /**
   * dest를 3등분하여 active가 윗부분 영역에 over중이라면 수행한다.
   */
  isAcceptable({ active, over }: DndOperationContext): boolean {
    if(active.id === over.id) return false;
    const activeRect = active.rect.current.translated;
    if(!activeRect) return false;

    const splitedRect = RectUtils.splitRectToThreeHorizontally(over.rect);
    return RectUtils.isRectCenterVerticallyInBoundary(activeRect, splitedRect.top);
  }

  getIndicatorMode({ overDepth }: DndOperationContext): IndicatorMode {
    return {
      mode: "line",
      depth: overDepth,
      position: "top"
    }
  }

  resolve({ active, over, toc }: DndOperationContext): Toc {
    const overNodeData = extractTocNodeDndData(over);
    const activeNodeData = extractTocNodeDndData(active);
    return produce(toc, draft => {
      const { parent, index } = TocOperations.findParent(draft, overNodeData.id);
      const activeNode = TocOperations.findNode(draft, activeNodeData.id);
      parent.children.splice(index, 0, activeNode);
    })
  }
}