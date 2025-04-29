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
    const readingUnitContent = await ReadingUnitContentLoader.createReadingUnitContent(bookId, newUnit);
    useReadingUnitStore.setState({ readingUnitContent });
  }, [bookId]);

  /**
   * 최초 렌더링시에 시작 unit 초기화
   */
  const init = useCallback((startingNodeId: string) => {
    const initialSequence = ReadingUnitService.createReadingUnitSequence(toc);
    const startingUnit = ReadingUnitService.findUnitContainingNode(startingNodeId, initialSequence);
    if (startingUnit === null) {
      throw new Error("StartingUnit을 찾을 수 없습니다.");
    }
    readUnit(startingUnit);
  }, [readUnit, toc]);

  const loadNextContent = useCallback(async () => {
    if (readingUnitContent === null) return;
    const newReadingUnitContent = await ReadingUnitContentLoader.loadNextContent(bookId, readingUnitContent);
    useReadingUnitStore.setState({ readingUnitContent: newReadingUnitContent });
  }, [bookId, readingUnitContent]);

  const moveUnitTo = useCallback((to: "prev" | "next") => {
    if (readingUnitContent === null) return;
    const currentUnitIndex = sequence.indexOf(readingUnitContent.readingUnit);
    const destUnitIndex = currentUnitIndex + (to === "prev" ? -1 : 1);
    const newReadingUnit = sequence[destUnitIndex];
    readUnit(newReadingUnit);
  }, [readingUnitContent, readUnit, sequence]);


  return {
    init,
    readUnit,
    loadNextContent,
    moveUnitTo,
  }
}