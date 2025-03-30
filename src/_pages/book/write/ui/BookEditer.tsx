'use client'
import { useEditorBookStore } from '@/entities/book'
import { SxProps } from "@mui/material"



type Props = {
  sx?: SxProps
}
export const BookEditer = ({
  sx
}: Props) => {
  const book = useEditorBookStore(s => s.book)

  return (
    <>
      {book.title}
    </>
  )
}