'use client'

import { usePublishedBookQuery } from '@/entities/book';
import { ReviewWidget } from '@/widgets/review';
import { Box, Container, SxProps, Typography } from "@mui/material";
import { PublishedBookContextProvider, usePublishedBookContext } from "../model/published-book-context";
import { AuthorProfilePaper } from "./AuthorProfilePaper";
import { BookPaper } from "./BookPaper";
import { TocPaper } from "./TocPaper";
import { BasePaper, PaperHeader } from './utils/base-paper';


const BookInfoContent = () => {
  const book = usePublishedBookContext();

  return (
    <Container maxWidth="md">
      <BookPaper />
      <TocPaper />
      <AuthorProfilePaper />
      <BasePaper>
        <PaperHeader title="리뷰" />
        <ReviewWidget bookId={book.id} reviews={book.reviews} />
      </BasePaper>
    </Container>
  );
};

type Props = {
  bookId: string;
  sx?: SxProps;
};
export const BookInfoPage = ({
  bookId,
  sx
}: Props) => {
  const query = usePublishedBookQuery(bookId);

  if (query.isLoading || query.data === undefined) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography>도서 정보를 불러오는 중...</Typography>
      </Box>
    );
  }

  return (
    <PublishedBookContextProvider value={query.data}>
      <BookInfoContent />
    </PublishedBookContextProvider>
  );
};