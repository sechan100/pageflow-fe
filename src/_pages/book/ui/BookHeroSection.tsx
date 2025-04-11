'use client';

import { Box, Button, Divider, Grid, Typography } from "@mui/material";
import { Book } from "lucide-react";
import Image from 'next/image';
import { useState } from 'react';
import { usePublishedBookContext } from "../model/published-book-context";
import { BookReviewRating } from "./BookReviewRating";
import { PublishedRecoredsSection } from './PublishedRecoredsSection';
import { BookInfoSectionPaper } from "./utils/BookInfoSectionPaper";

const bookCoverImageWidth = 300;
const bookCoverImageHeight = bookCoverImageWidth * 1.5;

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
  const [reviewScore, setReviewScore] = useState(3.7);
  const [reviewCount, setReviewCount] = useState(24);

  return (
    <BookInfoSectionPaper>
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
                <Grid size={{ xs: 6, md: 6 }}>
                  <PublishedRecoredsSection publishedRecords={book.publishedRecords} />
                </Grid>
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
    </BookInfoSectionPaper>
  );
};
