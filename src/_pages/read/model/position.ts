import { ReadableToc, ReadableTocFolder, ReadableTocNode, ReadableTocNodeType } from "@/entities/book";
import { createStoreContext } from "@/shared/zustand/create-store-context";

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

const getStartingPositionOfToc = (toc: ReadableToc): Position => {
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

type AdjacentContext = {
  prev: ReadableTocNode | null;
  currentId: string;
  next: ReadableTocNode | null;
}
const getAdjacentPosition = (toc: ReadableToc, currentPosition: Position): { prev: Position | null, next: Position | null } => {
  const context: AdjacentContext = { prev: null, currentId: currentPosition.tocNodeId, next: null };

  const currentNode = getCurrentPositionRecursive(toc.root, context);
  if (!currentNode) {
    throw new Error("Toc에서 현재 위치를 찾을 수 없습니다.");
  }
  const prev = context.prev ? {
    tocNodeId: context.prev.id,
    tocNodeType: context.prev.type,
    contentElementIndex: 1,
    contextText: null,
  } : null;

  const next = context.next ? {
    tocNodeId: context.next.id,
    tocNodeType: context.next.type,
    contentElementIndex: 1,
    contextText: null,
  } : null;

  return { prev, next };
}

const getCurrentPositionRecursive = (parent: ReadableTocFolder, context: AdjacentContext): ReadableTocNode | null => {
  for (let i = 0; i < parent.children.length; i++) {
    const node = parent.children[i];
    if (node.id === context.currentId) {
      // 다음 node를 현재 부모 수준에서 찾을 수 있는 경우 context.next를 할당, 할당하지 않으면 조부모 수준에서 next를 찾아야함을 요청
      if (i + 1 !== parent.children.length - 1) {
        return context.next = parent.children[i + 1];
      }
      return node;
    }
    context.prev = node;
    if (node.type === "FOLDER") {
      const target = getCurrentPositionRecursive(node as ReadableTocFolder, context);
      if (target) {
        if (context.next === null) {
          if (i + 1 !== parent.children.length - 1) {
            return context.next = parent.children[i + 1];
          }
        }
        return target;
      }
    }
  }
  return null;
}

type PositionStore = {
  prev: Position | null;
  position: Position;
  next: Position | null;
  setPosition: (toc: ReadableToc, position: Position) => void;
}
export const [PositionStoreContextProvider, usePositionStore] = createStoreContext<ReadableToc, PositionStore>((toc, set, get) => {
  // position: getStartingPositionOfToc(toc),
  const current: Position = {
    tocNodeId: "bceb5c28-b432-438c-afe7-f6afa8a1aeee",
    tocNodeType: "SECTION",
    contentElementIndex: 1,
    contextText: null,
  }
  const adjacent = getAdjacentPosition(toc, current);
  return {
    prev: adjacent.prev,
    position: current,
    next: adjacent.next,
    setPosition: (toc: ReadableToc, position: Position) => {
      const adjacent = getAdjacentPosition(toc, position);
      set({
        prev: adjacent.prev,
        position: position,
        next: adjacent.next,
      });
    },
  }
});