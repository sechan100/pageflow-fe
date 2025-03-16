import { produce } from "immer";
import { IndicatorMode } from "../../ui/Indicator";
import { TocOperations } from "../toc-operations";
import { extractTocNodeDndData } from "./dnd-data";
import { DndOperation, DndOperationContext, RelocateResult } from "./dnd-operation";
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

  relocate({ active, over, toc }: DndOperationContext): RelocateResult {
    const { id: overId } = extractTocNodeDndData(over);
    const { id: activeId } = extractTocNodeDndData(active);

    let destFolderId: string | null = null;
    let destIndex: number | null = null;

    const newToc = produce(toc, draft => {
      const parent = TocOperations.findParent(draft, overId);
      const target = TocOperations.removeNodeMutable(draft, activeId);
      destIndex = parent.children.findIndex(child => child.id === overId);
      parent.children.splice(destIndex, 0, target);

      destFolderId = parent.id;
    });

    if(!destFolderId || destIndex === null) {
      throw new Error("destFolderId 또는 destIndex를 찾을 수 없습니다.");
    }

    return {
      toc: newToc,
      form: {
        bookId: toc.bookId,
        targetNodeId: activeId,
        destFolderId,
        destIndex,
      }
    }
  }
}