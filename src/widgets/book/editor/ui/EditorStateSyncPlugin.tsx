'use client'
import { $generateNodesFromDOM } from '@lexical/html';
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { SxProps } from "@mui/material";
import { $getRoot, $insertNodes } from "lexical";
import { useEffect } from "react";


type Props = {
  htmlSerializedState?: string,
  sx?: SxProps
}
export const EditorStateSyncPlugin = ({
  htmlSerializedState,
  sx
}: Props) => {
  const [editor] = useLexicalComposerContext();

  // htmlSerializedState와 editor의 state를 동기화한다.
  useEffect(() => {
    if (htmlSerializedState === undefined) return;

    // update =====================
    editor.update(() => {
      const root = $getRoot();
      const isEmpty = root.getTextContent() === "";
      if (!isEmpty) return;

      const parser = new DOMParser();
      const dom = parser.parseFromString(htmlSerializedState, 'text/html');
      const nodes = $generateNodesFromDOM(editor, dom);
      root.clear();
      $insertNodes(nodes);
    });
  }, [editor, htmlSerializedState])

  return (
    <>

    </>
  )
}
