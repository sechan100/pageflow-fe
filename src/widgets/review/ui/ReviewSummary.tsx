'use client'
import { BookReviewRating } from "@/features/book";
import { Box, SxProps, Typography } from "@mui/material";
import { useMemo } from "react";
import { useReviewsContext } from "../model/context";
import { ReviewService } from "../model/review-service";



type Props = {
  sx?: SxProps;
}
export const ReviewSummary = ({
  sx
}: Props) => {
  const reviews = useReviewsContext();
  const reviewScoreAverage = useMemo(() => ReviewService.getReviewScoreAverage(reviews), [reviews]);

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: { xs: 'center', md: 'flex-start' }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="h2" sx={{ mr: 2 }}>{reviewScoreAverage}</Typography>
        <Box>
          <BookReviewRating score={reviewScoreAverage} />
          <Typography variant="body2" color="text.secondary">{reviews.length}개의 리뷰</Typography>
        </Box>
      </Box>
    </Box>
  )
}