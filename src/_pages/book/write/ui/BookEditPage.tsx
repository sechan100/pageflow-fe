'use client'
import { SxProps } from "@mui/material"
import { useBook } from "../model/use-book"



type Props = {
  sx?: SxProps
}
export const BookEditPage = ({
  sx
}: Props) => {
  const book = useBook(s => s.book)

  return (
    <>
      {book.title}
    </>
  )
}