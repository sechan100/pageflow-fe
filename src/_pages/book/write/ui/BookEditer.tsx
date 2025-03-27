'use client'
import { useBookStore } from '@/entities/book'
import { SxProps } from "@mui/material"



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