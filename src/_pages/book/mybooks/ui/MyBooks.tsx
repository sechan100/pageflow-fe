'use client'
import { Button, Container, Paper, SxProps, Typography } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { myBooksApi } from "../api/my-books"
import { MyBooks as MyBooksType } from "../model/my-books"
import { BookCard } from "./BookCard"
import { CreateBookModal } from "./CreateBookModal"
import { EmptyMyBooks } from "./EmptyMyBooks"



type Props = {
  sx?: SxProps
}
export const MyBooks = ({
  sx
}: Props) => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ['mybooks'],
    queryFn: myBooksApi,
  })


  // 로딩중 화면
  if (isLoading) {
    return <>로딩중...</>
  }

  // 에러시 화면
  if (isError) {
    return (
      <>
        내 책들을 가져오는 중 에러가 발생했습니다.
      </>
    )
  }

  const myBooks = data as MyBooksType;
  return (
    <Container maxWidth="lg" sx={{
      display: "flex",
      flexDirection: "column",
      ...sx
    }}>
      <Typography
        variant="h5"
        sx={{
          my: 2
        }}
      >
        내 책들
      </Typography>
      <Paper
        elevation={1}
        square={false}
        sx={{
          py: 5,
        }}
      >
        {/* 내 책이 없을 때 */}
        {myBooks.books.length === 0 && (<EmptyMyBooks />)}
        {/* 책 있을 때 */}
        {myBooks.books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
          />
        ))}
      </Paper>
    </Container>
  )
}