'use client';

import { Avatar, Box, Button, Divider, Paper, Typography } from "@mui/material";
import { usePublishedBookContext } from "../model/published-book-context";

export const AuthorProfile = () => {
  const book = usePublishedBookContext();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        mb: 4,
        borderRadius: 2,
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
      }}
    >
      <Typography variant="h4" gutterBottom>
        작가 소개
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
        <Avatar
          src={book.author.profileImageUrl}
          alt={book.author.penname}
          sx={{ width: 120, height: 120 }}
        />
        <Box>
          <Typography variant="h5" gutterBottom>{book.author.penname}</Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>12권의 작품 저자</Typography>
          <Typography variant="body1" paragraph sx={{ mt: 2 }}>
            {"작가 소개가 아직 등록되지 않았습니다."}
          </Typography>
          <Box sx={{ display: 'flex', mt: 2 }}>
            <Button variant="outlined" size="small" sx={{ mr: 1, borderRadius: 4 }}>
              작가 팔로우
            </Button>
            <Button variant="text" size="small" sx={{ borderRadius: 4 }}>
              모든 작품 보기
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};
