import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalEditor } from "lexical";
import { useEffect } from "react";
import { editorStateSyncUpdateTag } from "./use-lexical-editor-serialized-html-sync";




/**
 * useLexicalEditorSerializedHtmlSync와 같은 editorState를 변경하는 기능을 사용한다면,
 * 단순한 editor.registerUpdateListener로는 실제 사용자에 의해서 변경된 것인지 판단하기가 어렵다.
 * 해당 훅을 사용하면 실제 사용자의 입력에 의해서 editorState가 변경된 경우에만 onChangeByUser를 호출한다.
 */
export const useUserInputChangeUpdateListener = (onChangeByUser: (editor: LexicalEditor) => void) => {
  const [editor] = useLexicalComposerContext();

  // 자동저장 설정
  useEffect(() => {
    return editor.registerUpdateListener(({ tags, dirtyElements, editorState, prevEditorState, dirtyLeaves }) => {
      if (tags.has("history-merge") || tags.has(editorStateSyncUpdateTag)) return;
      if (dirtyElements.size === 0 && dirtyLeaves.size === 0) return;

      onChangeByUser(editor);
    })
  }, [onChangeByUser, editor]);
}