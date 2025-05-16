import { api } from "@/global/api";
import { ApiResponse } from "@/shared/res/api-response";


export type DeleteReviewForm = {
  bookId: string;
  reviewId: string;
}

export const deleteReviewApi = async ({ bookId, reviewId }: DeleteReviewForm): Promise<ApiResponse<void>> => {
  return await api
    .user()
    .delete<void>(`/user/books/${bookId}/reviews/${reviewId}`);
}