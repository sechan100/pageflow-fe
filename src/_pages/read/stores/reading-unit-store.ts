import { ReadableToc } from "@/entities/book";
import { createStoreContext } from "@/shared/zustand/create-store-context";
import { ReadaingUnitSequence, ReadingUnit, ReadingUnitService } from "../model/reading-unit";
import { ReadingUnitContent, ReadingUnitContentLoader } from "../model/reading-unit-content-loader";

type CreateReadingUnitStoreArgs = {
  bookId: string;
  toc: ReadableToc;
}

type ReadingUnitStore = {
  sequence: ReadaingUnitSequence;
  readingUnitContent: ReadingUnitContent | null;
  readUnit: (newUnit: ReadingUnit) => Promise<void>;
  findUnitContainingNode: (nodeId: string) => ReadingUnit;
  moveUnitTo: (to: "prev" | "next") => boolean;
}

export const [ReadingUnitContextProvider, useReadingUnitStore] = createStoreContext<CreateReadingUnitStoreArgs, ReadingUnitStore>((data, set, get) => ({
  sequence: ReadingUnitService.createReadingUnitSequence(data.toc),
  readingUnitContent: null,
  readUnit: async (newUnit: ReadingUnit) => {
    const newReadingUnitContent = await ReadingUnitContentLoader.createReadingUnitContent(data.bookId, newUnit);
    set({ readingUnitContent: newReadingUnitContent });
  },
  findUnitContainingNode: (nodeId: string) => {
    const unit = ReadingUnitService.findUnitContainingNode(nodeId, get().sequence);
    if (unit === null) {
      throw new Error("해당하는 Unit을 찾을 수 없습니다.");
    }
    return unit;
  },
  moveUnitTo: (to: "prev" | "next") => {
    const { readingUnitContent, sequence, readUnit } = get();
    if (readingUnitContent === null) return false;
    const currentUnitHeadNodeId = readingUnitContent.readingUnit.headNode.id;
    const currentUnitIndex = sequence.findIndex((unit) => unit.headNode.id === currentUnitHeadNodeId);
    // 처음이나 마지막 unit에 도달했을 때는 이동하지 않음
    if (currentUnitIndex === 0 && to === "prev"
      ||
      currentUnitIndex === sequence.length - 1 && to === "next") {
      return false;
    }
    const destUnitIndex = currentUnitIndex + (to === "prev" ? -1 : 1);
    const newReadingUnit = sequence[destUnitIndex];
    if (newReadingUnit === undefined) {
      throw new Error("이동하려는 Unit이 Sequence에 없습니다.");
    }
    set({ readingUnitContent: null });
    readUnit(newReadingUnit);
    return true;
  }
}));

