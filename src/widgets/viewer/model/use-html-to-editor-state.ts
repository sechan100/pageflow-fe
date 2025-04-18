import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";
import { useCallback, useEffect } from "react";
import { create } from "zustand";

type NormalizedLexicalNodeKey = {
  originalKey: string;
  key: number;
  offset: number;
}

type LexicalNodeKeyStore = {
  offset: number;
}
const useNormalizedKeyStore = create<LexicalNodeKeyStore>((set) => ({
  offset: 0,
}));

/**
 * lexical editor의 node들의 key를 1부터 시작하는 연속된 정수 key로 변환한다.
 * 
 * lexical editor의 node들은 내부적인 key값을 가지고 있다. 이 key는 lexical editor 인스턴스에서 SQUENCE처럼 관리되는데, 
 * editor에 html 구조등을 박아넣을 경우, 기존에 존재하던 node들 때문에, 그 key 값이 1부터 시작하지 않고, 3, 11과 같이 1이 아닌 정수부터 시작하게 된다.
 * 하지만 다행인 점은, 그 이후에 editor가 편집되지 않는다면, 일관된 순서대로 연속된 정수 key임은 보장된다.
 * 
 * 해당 훅에서는 lexical에서 node를 세어나가는 알고리즘을 기준으로 '첫번 째 node'를 찾고, 해당 node의 key를 1로 만들기 위한 보정값을 계산한다.
 * 이후, 해당 훅 context를 통해서 계산되는 node의 key는, 이 보정값을 적용하여, 첫번째 node의 key를 1이라고 가정했을 때의 보정된 key값을 반환한다.
 */
export const useNormalizedLexicalNodeKey = () => {
  const [editor] = useLexicalComposerContext();
  const { offset } = useNormalizedKeyStore();

  useEffect(() => editor.registerUpdateListener(({ editorState }) => editorState.read(() => {
    const root = $getRoot();
    const firstChild = root.getFirstChild();
    if (!firstChild) {
      throw new Error("no reader node first child");
    }
    const firstChildKey = Number(firstChild.getKey());
    const offsetValue = 1 - firstChildKey;
    useNormalizedKeyStore.setState({ offset: offsetValue });
  })), [editor]);
};

export const useGetNormalizedLexicalNodeKey = () => {
  const { offset } = useNormalizedKeyStore();

  const getNormalizedeLexicalNodeKey = useCallback((key: string): NormalizedLexicalNodeKey => {
    const keyNumber = Number(key);
    if (isNaN(keyNumber)) {
      throw new Error(`key is not a number: ${key}`);
    }
    return {
      originalKey: key,
      key: keyNumber + offset,
      offset: offset,
    }
  }, [offset]);

  return {
    getNormalizedeLexicalNodeKey,
  }
}