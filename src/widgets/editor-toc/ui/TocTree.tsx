'use client'
import { Box, SxProps } from "@mui/material";
import { TocRoot } from "./TocRoot";
import { TocToolBar } from "./TocToolBar";


type Props = {
  sx?: SxProps
}
export const TocTree = ({
  sx
}: Props) => {

  return (
    <>
      <TocToolBar />
      <Box
        sx={{
          overflowY: "auto",
          height: "100%",
        }}
      >
        <TocRoot />
      </Box>
    </>
  )
}