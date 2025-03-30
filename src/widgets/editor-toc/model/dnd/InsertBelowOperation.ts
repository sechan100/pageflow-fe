import { TocFolder, TocOperations } from '@/entities/book';
import { produce } from "immer";
import { IndicatorMode } from "../../ui/Indicator";
import { extractTocNodeDndData, TocFolderDndData } from "./dnd-data";
import { DndOperation, DndOperationContext, RelocateResult } from "./dnd-operation";
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

  relocate({ active, over, toc }: DndOperationContext): RelocateResult {
    const { id: overId } = extractTocNodeDndData(over);
    const { id: activeId } = extractTocNodeDndData(active);

    let destFolderId: string | null = null;
    let destIndex: number | null = null;

    const newToc = produce(toc, draft => {
      const parent = TocOperations.findParent(draft, overId);
      const target = TocOperations.removeNodeMutable(draft, activeId);
      destIndex = parent.children.findIndex(child => child.id === overId) + 1;
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