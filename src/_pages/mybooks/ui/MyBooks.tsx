'use client'
import { Box, Container, Grid, Paper, SxProps, Typography } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { myBooksApi } from "../api/my-books"
import { BookCard } from "./BookCard"
import { CreateBookButton } from "./CreateBookButton"
import { EmptyMyBooks } from "./EmptyMyBooks"



type Props = {
  sx?: SxProps
}
export const MyBooksPage = ({
  sx
}: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ['mybooks'],
    queryFn: myBooksApi,
  })


  // 로딩중 화면
  if (isLoading || !data) {
    return <>로딩중...</>
  }

  // 에러시 화면
  if (data.code !== "success") {
    return (
      <>
        내 책들을 가져오는 중 에러가 발생했습니다.
      </>
    )
  }

  const myBooks = data.myBooks;

  return (
    <Container maxWidth="lg" sx={{
      display: "flex",
      flexDirection: "column",
      ...sx
    }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            my: 2
          }}
        >
          내 책들
        </Typography>
        <CreateBookButton />
      </Box>
      <Paper
        elevation={1}
        square={false}
        sx={{
          py: 5,
          px: 5,
        }}
      >
        {/* 내 책이 없을 때 */}
        {myBooks.books.length === 0 && (<EmptyMyBooks />)}
        {/* 책 있을 때 */}
        <Grid
          container
        >
          {myBooks.books.map((book) => (
            <Grid
              key={book.id}
              size={{
                xs: 12,
                sm: 6,
                md: 3,
                lg: 2.4,
              }}
              sx={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <BookCard
                book={book}
              />
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container >
  )
}