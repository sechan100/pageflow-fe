import { Review } from "@/entities/book";
import { api } from "@/global/api";
import { ApiResponse } from "@/shared/res/api-response";


export type UpdateReviewForm = {
  bookId: string;
  reviewId: string;
  content: string;
  score: number;
}

export const updateReviewApi = async ({ bookId, reviewId, content, score }: UpdateReviewForm): Promise<ApiResponse<Review>> => {
  return await api
    .user()
    .data({
      content,
      score,
    })
    .post<Review>(`/user/books/${bookId}/reviews/${reviewId}`);
}