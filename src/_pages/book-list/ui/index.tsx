'use client'
import { Selector, SelectorOption } from "@/shared/ui/Selector";
import { Container, Grid, SxProps } from "@mui/material";
import { useEffect } from 'react';
import { SortBy, useBookSlice, useBookSliceActions } from "../model/use-book-slice";
import { BookCard } from "./BookCard";
import { useInfiniteScrollObserver } from "./use-infinite-scroll-observer";

const sortByOptions: SelectorOption<SortBy>[] = [
  { label: '출간일 오름차순', value: "PUBLISHED_ASC" },
  { label: '최근 출간됨', value: "PUBLISHED_DESC" },
];

const getSortByOption = (sortBy: SortBy): SelectorOption<SortBy> => {
  const label = sortByOptions.find(option => option.value === sortBy)?.label;
  if (!label) {
    throw new Error(`Unknown sortBy: ${sortBy}`);
  }
  return {
    value: sortBy,
    label
  }
}

type Props = {
  sx?: SxProps;
}
export const BookListPage = ({ sx }: Props) => {
  const books = useBookSlice(s => s.books);
  const sortBy = useBookSlice(s => s.sortBy);
  const { loadNextSlice, setSortBy } = useBookSliceActions();

  const { lastItemRef } = useInfiniteScrollObserver({ onLoadMore: loadNextSlice });

  // 초기 데이터 로드
  useEffect(() => {
    loadNextSlice();
  }, [loadNextSlice]);

  return (
    <Container maxWidth="xl" sx={{ py: 4, ...sx }}>
      {/* <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
      </Typography> */}
      <Selector
        option={getSortByOption(sortBy)}
        options={sortByOptions}
        title="정렬"
        onChange={(option) => {
          setSortBy(option);
        }}
      />

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