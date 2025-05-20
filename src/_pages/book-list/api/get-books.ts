
import { api } from "@/global/api";
import { PublishedListBook } from "../model/published-list-book";
import { SortBy } from "../model/use-book-slice";




export const getBooksApi = async (page: number, size: number, sortBy: SortBy): Promise<PublishedListBook[]> => {
  const res = await api
    .guest()
    .params({ page: String(page), size: String(size), sortBy })
    .get<PublishedListBook[]>("/reader/books")

  if (!res.isSuccess) {
    throw new Error(res.description);
  }
  return res.data;
}