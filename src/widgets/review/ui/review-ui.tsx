'use client';

import { Avatar, Box, Button, Paper, Typography } from "@mui/material";
import { BookReviewRating } from "./BookReviewRating";

const ReviewItem = ({ name, rating, date, content }: { name: string; rating: number; date: string; content: string }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      mb: 2,
      bgcolor: 'background.default',
      borderRadius: 2
    }}
  >
    <Box sx={{ display: 'flex', mb: 2 }}>
      <Avatar sx={{ mr: 2 }}>{name.charAt(0)}</Avatar>
      <Box>
        <Typography variant="subtitle1">{name}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <BookReviewRating score={rating} />
          <Typography variant="caption" sx={{ ml: 1 }}>{date}</Typography>
        </Box>
      </Box>
    </Box>
    <Typography variant="body1">{content}</Typography>
  </Paper>
);


export const ReviewWidget = () => {
  // 샘플 리뷰 데이터
  const reviews = [
    {
      id: '1',
      name: '김민수',
      rating: 5,
      date: '2023년 12월 12일',
      content: '이 책은 정말 통찰력 있고 잘 쓰여졌어요. 손에서 내려놓을 수 없었습니다! 저자는 복잡한 개념을 쉽게 접근할 수 있게 하는 필력이 있습니다.'
    },
    {
      id: '2',
      name: '이지은',
      rating: 4,
      date: '2023년 11월 30일',
      content: '전반적으로 훌륭한 책입니다. 일부분은 조금 지루했지만, 주요 주제들은 강력하고 생각을 자극시키는 내용이었습니다.'
    }
  ];

  return (
    <Box>
      {/* 리뷰 통계 */}
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'center', md: 'flex-start' },
        justifyContent: 'space-between',
        mb: 4,
        gap: 3,
        pb: 3,
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: { xs: 'center', md: 'flex-start' }
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h2" sx={{ mr: 2 }}>4.5</Typography>
            <Box>
              <BookReviewRating score={4.5} />
              <Typography variant="body2" color="text.secondary">24개의 리뷰 기준</Typography>
            </Box>
          </Box>
        </Box>

        <Button variant="contained" sx={{ borderRadius: 4, px: 3 }}>
          리뷰 작성하기
        </Button>
      </Box>

      {/* 리뷰 목록 */}
      {reviews.map(review => (
        <ReviewItem
          key={review.id}
          name={review.name}
          rating={review.rating}
          date={review.date}
          content={review.content}
        />
      ))}

      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Button variant="outlined">더 보기</Button>
      </Box>
    </Box>
  );
};
