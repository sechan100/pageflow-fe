'use client'
import { ReadableTocNodeType } from "@/entities/book"
import { SxProps } from "@mui/material"
import { useEffect } from "react"
import { emitReaderEvent } from "../model/reader-event"


const folderContentCn = "folder-content"
const sectionContentCn = "section-content"

type Props = {
  tocNodeId: string;
  type: ReadableTocNodeType;
  children: React.ReactNode;
  sx?: SxProps;
}
export const NodeContentWrapper = ({
  tocNodeId,
  type,
  children,
  sx
}: Props) => {
  const typeCn = type === "FOLDER" ? folderContentCn : sectionContentCn;

  useEffect(() => {
    emitReaderEvent("content-rendered")
  }, [tocNodeId])

  return (
    <section className={typeCn} data-toc-node-id={tocNodeId}>
      {children}
    </section>
  )
}

type NodeContentInfo = {
  nodeId: string;
  nodeType: ReadableTocNodeType;
}
export const extractNodeContentInfoFromWrapperElement = (element: HTMLElement): NodeContentInfo => {
  const nodeId = element.dataset.tocNodeId
  if (!nodeId) {
    throw new Error("Node ID not found in element")
  }
  const nodeType = element.classList.contains(folderContentCn) ? "FOLDER" : "SECTION"
  return {
    nodeId,
    nodeType
  }
}