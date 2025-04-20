import { createStoreContext } from "@/shared/zustand/create-store-context";
import { ReadableToc, ReadableTocNodeType } from "../../../entities/book/model/readable-toc";

export type Position = {
  tocNodeId: string;
  tocNodeType: ReadableTocNodeType;

  /**
   * Content Element Index
   * section content의 html 구조에 따라 자식 element들에 1부터 순서대로 부여한 번호이다.
   * 같은 html content가 렌더링되면 각 element는 언제나 동일한 CNKey를 부여받는다.
   * Lexical Editor가 Node들에게 Key를 부여하는 방식과 유사하다.
   * 다만 실제로 lexical editor에서 node가 가진 key와 CNKEY는 다를 수 있다.
   */
  contentElementIndex: number;

  /**
   * content element 안에서의 구체적인 문자열 위치
   * text element가 아닌 경우 null
   */
  contextText: string | null;
};

export const getStartingPositionOfToc = (toc: ReadableToc): Position => {
  const root = toc.root;
  const firstChild = root.children[0];

  if (!firstChild) {
    throw new Error("Toc에 child가 없습니다.");
  }

  return {
    tocNodeId: firstChild.id,
    tocNodeType: firstChild.type,
    contentElementIndex: 1,
    contextText: null,
  };
}

type PositionStore = {
  position: Position;
  setPosition: (position: Position) => void;
}
export const [PositionStoreContextProvider, usePositionStore] = createStoreContext<ReadableToc, PositionStore>((toc, set, get) => ({
  // position: getStartingPositionOfToc(toc),
  position: {
    tocNodeId: "9725c2a3-d1fb-4d4d-8f17-713c8c0f7fe9",
    tocNodeType: "SECTION",
    contentElementIndex: 1,
    contextText: null,
  },
  setPosition: (position: Position) => set({ position }),
}));
