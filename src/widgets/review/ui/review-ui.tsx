'use client';

import { Review } from '@/entities/book';
import { Box } from "@mui/material";
import { BookIdContextProvider } from '../model/context';
import { InitReviewsStoreConfig } from '../model/use-reviews-store';
import { OrderSelector } from './OrderSelector';
import { ReviewList } from './ReviewList';
import { ReviewSummary } from './ReviewSummary';


type Props = {
  bookId: string;
  reviews: Review[];
}
export const ReviewWidget = ({
  bookId,
  reviews
}: Props) => {

  return (
    <BookIdContextProvider value={bookId}>
      <InitReviewsStoreConfig reviews={reviews} />
      <Box>
        {/* 리뷰 통계 */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: "center",
          justifyContent: 'space-between',
          mb: 4,
          gap: 3,
          pb: 3,
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}>
          <ReviewSummary />
          <OrderSelector />
        </Box>
        <ReviewList />
      </Box>
    </BookIdContextProvider>
  );
};
