'use client'
import { Box, SxProps } from "@mui/material"
import { ReadableSectionContent } from "../model/readable-content"
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

  return (
    <Box
      component={"section"}
      data-section-id={section.id}
      sx={{
        breakBefore: section.shouldBreakSection ? "column" : undefined,
      }}
    >
      {children}
    </Box>
  )
}