'use client';

import { BookReviewRating } from '@/features/book';
import { useNextRouter } from "@/shared/hooks/useNextRouter";
import { Box, Button, Divider, Grid, Typography } from "@mui/material";
import { Book } from "lucide-react";
import Image from 'next/image';
import { useState } from 'react';
import { usePublishedBookContext } from "../model/published-book-context";
import { CharacterCountSection } from "./CharacterCountSection";
import { PublishedRecoredsSection } from './PublishedRecoredsSection';
import { SectionPaper } from "./utils/SectionPaper";

const bookCoverImageWidth = 300;
const bookCoverImageHeight = bookCoverImageWidth * 1.5;

const bookReaderPageUrl = (bookId: string) => `/read/${bookId}`;

const BookCoverImage = () => {
  const book = usePublishedBookContext();

  return (
    <Box sx={{
      position: 'relative',
      width: bookCoverImageWidth,
      height: bookCoverImageHeight,
      borderRadius: 1,
      boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.22)',
      overflow: 'hidden',
    }}>
      <Image
        src={book.coverImageUrl}
        alt={book.title}
        fill
        priority
      />
    </Box>
  )
}

export const BookHeroSection = () => {
  const book = usePublishedBookContext();
  const { router } = useNextRouter();
  const [reviewScore, setReviewScore] = useState(3.7);
  const [reviewCount, setReviewCount] = useState(24);

  return (
    <SectionPaper>
      <Grid container spacing={2} justifyContent="space-evenly">
        {/* 책 표지 이미지 */}
        <Grid size={{ xs: 12, md: 4 }}>
          <BookCoverImage />
        </Grid>

        {/* 책 상세 정보 */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* 작가 이름 */}
            <Typography variant="overline" color="textSecondary">
              {book.authorProfile.penname} 작가
            </Typography>

            {/* 책 제목 */}
            <Typography
              component="h1"
              variant="h4"
              sx={{
                fontWeight: 600,
                mb: 1
              }}
            >
              {book.title}
            </Typography>

            {/* 리뷰 점수 */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <BookReviewRating score={reviewScore} />
              <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                {reviewScore} ({reviewCount}개 리뷰)
              </Typography>
            </Box>

            <Box sx={{ mt: 7, mb: 4 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                도서 정보
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <CharacterCountSection charCount={book.totalCharCount} />
                <PublishedRecoredsSection publishedRecords={book.publishedRecords} />
              </Grid>
            </Box>

            <Box sx={{
              mt: 'auto',
              display: 'flex',
              gap: 2,
              flexWrap: 'wrap'
            }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<Book />}
                onClick={() => router.push(bookReaderPageUrl(book.id))}
                sx={{
                  borderRadius: 6,
                  px: 4,
                  py: 1.5
                }}
              >
                열람하기
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </SectionPaper>
  );
};
