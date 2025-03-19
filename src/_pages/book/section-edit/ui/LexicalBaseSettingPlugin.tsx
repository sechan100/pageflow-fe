'use client'
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from '@lexical/utils';
import { SxProps } from "@mui/material";
import { useEffect } from "react";



type Props = {
  sx?: SxProps
}
export const LexicalBaseSettingPlugin = ({
  sx
}: Props) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => mergeRegister(
  ), [editor]);

  return (
    <>

    </>
  )
}