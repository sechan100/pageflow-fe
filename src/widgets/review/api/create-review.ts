import { Review } from "@/entities/book";
import { api } from "@/global/api";
import { ApiResponse } from "@/shared/res/api-response";


export type CreateReviewForm = {
  bookId: string;
  content: string;
  score: number;
}

export const createReviewApi = async ({ bookId, content, score }: CreateReviewForm): Promise<ApiResponse<Review>> => {
  return await api
    .user()
    .data({
      content,
      score,
    })
    .post<Review>(`/user/books/${bookId}/reviews`);
}