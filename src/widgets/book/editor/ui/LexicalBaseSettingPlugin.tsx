'use client'
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from '@lexical/utils';
import { SxProps } from "@mui/material";
import { FORMAT_ELEMENT_COMMAND } from "lexical";
import { useEffect } from "react";



type Props = {
  sx?: SxProps
}
export const LexicalBaseSettingPlugin = ({
  sx
}: Props) => {
  const [editor] = useLexicalComposerContext();

  // editor의 모든 노드를 출력
  // useEffect(() => {
  //   const nodes = editor._nodes.values().map(n => n.klass).toArray();
  //   console.log(nodes);
  // }, [editor]);

  useEffect(() => mergeRegister(
    // FORMAT_ELEMENT_COMMAND Command를 해제
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