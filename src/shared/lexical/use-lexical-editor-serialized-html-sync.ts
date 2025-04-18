import { $generateNodesFromDOM } from "@lexical/html";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, $insertNodes } from "lexical";
import { useEffect } from "react";



/**
 * 직렬화된 html 문자열과 editor의 state를 동기화한다.
 * @param html 
 */
export const useLexicalEditorSerializedHtmlSync = (html: string | null) => {
  const [editor] = useLexicalComposerContext();

  // htmlSerializedState와 editor의 state를 동기화한다.
  useEffect(() => {
    if (html === null) return;

    // update
    editor.update(() => {
      const root = $getRoot();
      const isEmpty = root.getTextContent() === "";
      if (!isEmpty) return;

      const parser = new DOMParser();
      const dom = parser.parseFromString(html, 'text/html');
      const nodes = $generateNodesFromDOM(editor, dom);
      root.clear();
      $insertNodes(nodes);
    }, {
      tag: editorStateSyncUpdateTag,
    });
  }, [editor, html])
};
export const editorStateSyncUpdateTag = 'editor-state-sync';
