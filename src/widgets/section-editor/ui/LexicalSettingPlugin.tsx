'use client'
import { useLexicalEditorSerializedHtmlSync } from "@/shared/lexical/use-lexical-editor-serialized-html-sync";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from '@lexical/utils';
import { SxProps } from "@mui/material";
import { FORMAT_ELEMENT_COMMAND } from "lexical";
import { useEffect } from "react";
import { useSectionEditorSave } from "../model/use-section-editor-save";



type Props = {
  sectionId: string,
  serializedHtml: string | null,
  sx?: SxProps
}
/**
 * 해당 컴포넌트 플러그인은 Lexical의 추가적인 설정들을 로드한다.
 */
export const LexicalSettingPlugin = ({
  sectionId,
  serializedHtml,
  sx
}: Props) => {
  const [editor] = useLexicalComposerContext();
  useSectionEditorSave(sectionId);
  useLexicalEditorSerializedHtmlSync(serializedHtml);

  // editor의 모든 노드를 출력
  // const nodes = editor._nodes.values().map(n => n.klass).toArray();
  // console.log(nodes);

  // editor의 모든 command를 출력
  // const commands = editor._commands.keys().map(c => c.type).toArray();
  // console.log(commands);

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