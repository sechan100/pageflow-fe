'use client'
import { TRANSFORMERS } from '@lexical/markdown';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { SxProps } from "@mui/material";



type Props = {
  sx?: SxProps;
}
export const MarkdownPlugin = ({
  sx
}: Props) => {

  return (
    <>
      {/* TRASFORMERS를 직접 제공해서 HorizontalRuleNode의 node transform을 제거 */}
      <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
    </>
  )
}