import { Review } from "@/entities/book";
import { createDataContext } from "@/shared/zustand/create-data-context";

export const [BookIdContextProvider, useBookIdContext] = createDataContext<string>();
export const [ReviewsContextProvider, useReviewsContext] = createDataContext<Review[]>();