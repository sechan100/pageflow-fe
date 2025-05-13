'use client'

import { usePublishedBookQuery } from '@/entities/book';
import { ReviewWidget } from '@/widgets/review';
import { Box, Container, SxProps, Typography } from "@mui/material";
import { PublishedBookContextProvider, usePublishedBookContext } from "../model/published-book-context";
import { AuthorProfile } from "./AuthorProfile";
import { BookHeroSection } from "./BookHeroSection";
import { TableOfContents } from "./TableOfContents";
import { SectionHeader } from './utils/SectionHeader';
import { SectionPaper } from './utils/SectionPaper';


const BookInfoContent = () => {
  const book = usePublishedBookContext();

  return (
    <Container maxWidth="lg">
      <BookHeroSection />
      <TableOfContents />
      <AuthorProfile />
      <SectionPaper>
        <SectionHeader title="리뷰" />
        <ReviewWidget bookId={book.id} reviews={book.reviews} />
      </SectionPaper>
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