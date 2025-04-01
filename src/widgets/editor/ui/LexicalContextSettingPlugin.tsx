'use client'
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from '@lexical/utils';
import { SxProps } from "@mui/material";
import { FORMAT_ELEMENT_COMMAND } from "lexical";
import { useEffect } from "react";
import { useLexicalEditorSave } from "../model/use-lexical-editor-save";
import { useLexicalEditorSerializedHtmlSync } from "../model/use-lexical-editor-serialized-html-sync";



type Props = {
  sectionId: string,
  serializedHtml: string | null,
  sx?: SxProps
}
export const LexicalBaseSettingPlugin = ({
  sectionId,
  serializedHtml,
  sx
}: Props) => {
  const [editor] = useLexicalComposerContext();
  useLexicalEditorSave(sectionId);
  useLexicalEditorSerializedHtmlSync(serializedHtml)

  // editor의 모든 노드를 출력
  // useEffect(() => {
  //   const nodes = editor._nodes.values().map(n => n.klass).toArray();
  //   console.log(nodes);
  // }, [editor]);

  // FORMAT_ELEMENT_COMMAND Command를 해제
  useEffect(() => mergeRegister(
    editor.registerCommand(FORMAT_ELEMENT_COMMAND,
      (p) => {
        // do nothing
        return true;
      },
      4
    )
  ), [editor]);

  return (
    <>

    </>
  )
}