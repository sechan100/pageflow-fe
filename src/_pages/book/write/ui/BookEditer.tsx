'use client'
import { SxProps } from "@mui/material"
import { useBookStore } from "../../../../entities/book/model/use-book"



type Props = {
  sx?: SxProps
}
export const BookEditer = ({
  sx
}: Props) => {
  const book = useBookStore(s => s.book)

  return (
    <>
      {book.title}
    </>
  )
}