'use client'
import { SxProps, Typography } from "@mui/material";
import { useReviewsStore } from "../model/use-reviews-store";
import { ReviewBox } from "./ReviewBox";
import { ReviewEditor } from "./ReviewEditor";
import { ReviewItem } from "./ReviewItem";



type Props = {
  sx?: SxProps;
}
export const ReviewList = ({
  sx
}: Props) => {
  const reviews = useReviewsStore(s => s.reviews);
  const canWriteReview = useReviewsStore(s => s.canWriteReview);

  return (
    <>
      {canWriteReview && (
        <ReviewBox>
          <ReviewEditor review={null} />
        </ReviewBox>
      )}
      {reviews.map(review => <ReviewItem key={review.id} review={review} />)}
      {reviews.length === 0 && (
        <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary' }}>
          아직 작성된 리뷰가 없습니다.
        </Typography>
      )}
    </>
  )
}