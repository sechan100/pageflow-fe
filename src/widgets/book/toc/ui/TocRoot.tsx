'use client'
import { SxProps } from "@mui/material"
import { useToc } from "../model/use-toc"
import { renderTocNode } from "./render-toc-node"



type Props = {
  sx?: SxProps
}
export const TocRoot = ({
  sx
}: Props) => {
  const toc = useToc(s => s.toc);

  return (
    <>
      {toc.root.children.map(child => renderTocNode(child, 0))}
    </>
  )
}