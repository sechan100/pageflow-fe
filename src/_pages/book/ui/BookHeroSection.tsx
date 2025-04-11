'use client';

import BookmarkIcon from '@mui/icons-material/Bookmark';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Box, Button, Divider, Grid, Paper, Typography } from "@mui/material";
import Image from 'next/image';
import { useState } from 'react';
import { usePublishedBookContext } from "../model/published-book-context";
import { BookReviewRating } from "./BookReviewRating";

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
    <Paper
      elevation={1}
      sx={{
        p: 4,
        mb: 4,
        borderRadius: 2,
        bgcolor: 'background.paper',
      }}
    >
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
              {book.author.penname} 작가
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
                <Grid size={{ xs: 6, md: 3 }}>
                  <Typography variant="body2" color="text.secondary">출판사</Typography>
                  <Typography variant="body1">페이지플로우 출판</Typography>
                  {/* 에디션 */}
                  <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600, mb: 3 }}>
                    에디션: {book.edition}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Typography variant="body2" color="text.secondary">페이지 수</Typography>
                  <Typography variant="body1">354</Typography>
                </Grid>
                <Grid size={{ xs: 6, md: 6 }}>
                  <Typography variant="body2" color="text.secondary">출판 기록</Typography>
                  <Typography variant="body1" color="text.secondary">2024-02-12 초판 발행(25쇄)</Typography>
                  <Typography variant="body1" color="text.secondary">2024-9-28 개정판 발행(324쇄)</Typography>
                  <Typography variant="body1" color="text.secondary">2025-01-13 개정 2판(8쇄)</Typography>
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
                startIcon={<ShoppingCartIcon />}
                sx={{
                  borderRadius: 6,
                  px: 4,
                  py: 1.5
                }}
              >
                구매하기
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<BookmarkIcon />}
                sx={{
                  borderRadius: 6,
                  px: 4,
                  py: 1.5
                }}
              >
                찜하기
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};
