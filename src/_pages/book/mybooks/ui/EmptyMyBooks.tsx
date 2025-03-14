'use client'
import { Box, Button, Container, SxProps, Typography } from "@mui/material"
import { CreateBookModal } from "./CreateBookModal"
import { useState } from "react"
import { NotebookPen } from "lucide-react"



type Props = {
  sx?: SxProps
}
export const EmptyMyBooks = ({
  sx
}: Props) => {
  const [open, setOpen] = useState(false)

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
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
      >
        + 새로운 책 집필하기
      </Button>
      <CreateBookModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </Box>
  )
}