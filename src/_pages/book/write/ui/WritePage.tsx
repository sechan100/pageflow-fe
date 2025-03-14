'use client'
import { BookWithAuthor } from "@/entities/book"
import { Box, SxProps } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { getBookApi } from "../api/get-book"
import { UseBookProvider } from "../model/use-book"
import { SideDrawer } from "./SideDrawer"



type Props = {
  bookId: string
  sx?: SxProps
}
export const WritePage = ({
  bookId,
  sx
}: Props) => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ['book', bookId],
    queryFn: () => getBookApi(bookId)
  });

  if (isLoading) {
    return (<div>Loading...</div>)
  }
  if (isError) {
    return (<div>Error...</div>)
  }

  const book = data as BookWithAuthor;

  return (
    <UseBookProvider
      data={book}
      onDataChange={(s, book) => s.setState({ book })}
    >
      <Box sx={{
        display: 'flex',
      }}>
        <SideDrawer />
        <Box>
          {book.title}
        </Box>
      </Box>
    </UseBookProvider >
  )
}