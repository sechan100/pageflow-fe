'use client'
import { Box, SxProps, Typography } from "@mui/material"
import { NotebookPen } from "lucide-react"



type Props = {
  sx?: SxProps
}
export const EmptyMyBooks = ({
  sx
}: Props) => {

  return (
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      py: 10,
      ...sx
    }}>
      <NotebookPen
        size={100}
        color="#ccc"
      />
      <Typography sx={{
        my: 2
      }}>
        아직 집필중인 책이 없습니다.
      </Typography>
    </Box>
  )
}