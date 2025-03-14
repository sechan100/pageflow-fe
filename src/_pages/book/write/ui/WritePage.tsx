'use client'
import { SxProps } from "@mui/material"



type Props = {
  bookId: string
  sx?: SxProps
}
export const WritePage = ({
  bookId,
  sx
}: Props) => {

  return (
    <>
      {bookId}
    </>
  )
}