'use client'
import { Container, Grid, SxProps, Typography } from "@mui/material";
import { useCallback, useEffect } from 'react';
import { useBookSlice, useBookSliceActions } from "../model/use-book-slice";
import { BookCard } from "./BookCard";
import { useInfiniteScrollObserver } from "./use-infinite-scroll-observer";


type Props = {
  sx?: SxProps;
}
export const BookListPage = ({ sx }: Props) => {
  const books = useBookSlice(s => s.books);
  const { loadNextSlice } = useBookSliceActions();

  const loadMore = useCallback(async () => {
    loadNextSlice();
  }, [loadNextSlice]);

  const { lastItemRef } = useInfiniteScrollObserver({ onLoadMore: loadMore });

  // 초기 데이터 로드
  useEffect(() => {
    loadNextSlice();
  }, [loadNextSlice]);

  return (
    <Container maxWidth="xl" sx={{ py: 4, ...sx }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
        책 목록
      </Typography>

      <Grid container columns={30} spacing={3}>
        {books.map((book, index) => (
          <Grid
            size={{
              xs: 15,
              sm: 10,
              md: 6,
              lg: 6,
            }}
            key={book.id}
            ref={books.length === index + 1 ? lastItemRef : undefined}
          >
            <BookCard book={book} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};