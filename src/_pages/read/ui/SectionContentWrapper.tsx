'use client'
import { Box, SxProps } from "@mui/material"
import { useEffect } from "react"
import { ReadableSectionContent } from "../model/readable-content"
import { contentRenderedEvent } from "../model/reader-event"
import { useLayoutStore } from "../model/use-reader-layout-store"


type Props = {
  section: ReadableSectionContent;
  children: React.ReactNode;
  sx?: SxProps;
}
export const SectionContentWrapper = ({
  section,
  children,
  sx
}: Props) => {
  const { height } = useLayoutStore();

  useEffect(() => {
    contentRenderedEvent.emit()
  }, [])

  return (
    <Box
      component={"section"}
      data-section-id={section.id}
      sx={{
        breakBefore: section.shouldBreakSection ? "column" : undefined,
        // "&::before": shouldBreakColumn ? {
        //   content: "''",
        //   visibility: "hidden",
        //   userSelect: "none",
        //   display: "block",
        //   breakBefore: "column",
        //   height,
        // } : {},
      }}

    >
      {children}
    </Box>
  )
}