import { produce } from "immer";
import { IndicatorMode } from "../../ui/Indicator";
import { TocOperations } from "../toc-operations";
import { extractTocNodeDndData, TocFolderDndData } from "./dnd-data";
import { DndOperation, DndOperationContext, RelocateResult } from "./dnd-operation";
import { RectUtils } from "./rect-utils";

/**
 * over가 folder일 때, over의 첫번째 자식으로 active를 삽입하는 operation
 */
export class InsertFirstIntoOperation implements DndOperation {

  /**
   * over가 folder이면서 open 상태인 경우,
   * dest를 3등분하여 active가 bottom에 over중이라면 수행한다.
   */
  isAcceptable({ active, over }: DndOperationContext): boolean {
    if(active.id === over.id) return false;
    const activeRect = active.rect.current.translated;
    if(!activeRect) return false;

    /**
     * 혹시 아래 로직에서 에러가 발생한다면, 아마 isOpen을 관리하는 다른 기능들에 문제가 생겼을 가능성이 높다.
     */
    // over의 상태 확인
    const data = extractTocNodeDndData(over);
    if(data.type === "folder"){
      const { node, isOpen } = data as TocFolderDndData;
      if(isOpen){
        if(node.children.length === 0) return false;
        // rect 계산
        const splitedRect = RectUtils.splitRectToThreeHorizontally(over.rect);
        return RectUtils.isRectCenterVerticallyInBoundary(activeRect, splitedRect.bottom);
      }
    }
    return false;
  }

  getIndicatorMode({ overDepth }: DndOperationContext): IndicatorMode {
    return {
      mode: "line",
      depth: overDepth + 1,
      position: "bottom"
    }
  }
  
  relocate({ active, over, toc }: DndOperationContext): RelocateResult {
    const { id: overId } = extractTocNodeDndData(over);
    const { id: activeId } = extractTocNodeDndData(active);

    const destFolderId: string = overId;

    const newToc = produce(toc, draft => {
      const parent = TocOperations.findFolder(draft, overId);
      const target = TocOperations.removeNodeMutable(draft, activeId);
      parent.children.unshift(target);
    });

    return {
      toc: newToc,
      form: {
        bookId: toc.bookId,
        targetNodeId: activeId,
        destFolderId,
        destIndex: 0,
      }
    }
  }
}