'use client'
import { SxProps } from "@mui/material"
import { useBookStore } from "../model/use-book"



type Props = {
  sx?: SxProps
}
export const BookEditPage = ({
  sx
}: Props) => {
  const book = useBookStore(s => s.book)

  return (
    <>
      {book.title}
    </>
  )
}