import { useCallback } from "react";
import { create } from "zustand";
import { useBookContext } from "../model/context/book-context";
import { useTocContext } from "../model/context/toc-context";
import { ReadaingUnitSequence, ReadingUnit, ReadingUnitService } from "../model/reading-unit";
import { ReadingUnitContent, ReadingUnitContentLoader } from "../model/reading-unit-content-loader";



type ReadingUnitStore = {
  sequence: ReadaingUnitSequence;
  readingUnitContent: ReadingUnitContent | null;
}

export const useReadingUnitStore = create<ReadingUnitStore>(() => ({
  sequence: [],
  readingUnitContent: null,
}));


export const useReadingUnitExplorer = () => {
  const { sequence, readingUnitContent } = useReadingUnitStore();
  const { id: bookId } = useBookContext();
  const toc = useTocContext();

  /**
   * 새로운 unit을 읽기 대상으로 지정한다.
   */
  const readUnit = useCallback(async (newUnit: ReadingUnit) => {
    useReadingUnitStore.setState({ readingUnitContent: null });
    const newReadingUnitContent = await ReadingUnitContentLoader.createReadingUnitContent(bookId, newUnit);
    useReadingUnitStore.setState({ readingUnitContent: newReadingUnitContent });
  }, [bookId]);

  /**
   * 최초 렌더링시에 시작 unit 초기화
   */
  const init = useCallback((startingNodeId: string) => {
    const initialSequence = ReadingUnitService.createReadingUnitSequence(toc);
    useReadingUnitStore.setState({ sequence: initialSequence });
    const startingUnit = ReadingUnitService.findUnitContainingNode(startingNodeId, initialSequence);
    if (startingUnit === null) {
      throw new Error("StartingUnit을 찾을 수 없습니다.");
    }
    readUnit(startingUnit);
  }, [readUnit, toc]);

  /**
   * 이전/다음 unit으로 이동
   * @param to 이동할 방향
   * @returns 이동 성공 여부
   */
  const moveUnitTo = useCallback((to: "prev" | "next"): boolean => {
    if (readingUnitContent === null) return false;
    const currentUnitHeadNodeId = readingUnitContent.readingUnit.headNode.id;
    const currentUnitIndex = sequence.findIndex((unit) => unit.headNode.id === currentUnitHeadNodeId);
    // 처음이나 마지막 unit에 도달했을 때는 이동하지 않음
    if (
      currentUnitIndex === 0 && to === "prev"
      ||
      currentUnitIndex === sequence.length - 1 && to === "next"
    ) {
      return false;
    }
    const destUnitIndex = currentUnitIndex + (to === "prev" ? -1 : 1);
    const newReadingUnit = sequence[destUnitIndex];
    if (newReadingUnit === undefined) {
      throw new Error("이동하려는 Unit이 Sequence에 없습니다.");
    }
    readUnit(newReadingUnit);
    return true;
  }, [readingUnitContent, readUnit, sequence]);


  return {
    init,
    moveUnitTo,
    readUnit,
  }
}