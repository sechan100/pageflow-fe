import { Review } from "@/entities/book";


const getReviewScoreAverage = (reviews: Review[]): number => {
  if (reviews.length === 0) return 0;
  const totalScore = reviews.reduce((acc, review) => acc + review.score, 0);
  const average = totalScore / reviews.length;
  return Math.round(average * 10) / 10;
}


export const ReviewService = {
  getReviewScoreAverage,
}