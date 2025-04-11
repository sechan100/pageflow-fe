import { api } from "@/global/api";
import { useQuery } from "@tanstack/react-query";
import { PublishedBook } from "../model/published-book";




type Form = {
  bookId: string;
}

const getPublishedBookApi = async ({ bookId }: Form): Promise<PublishedBook> => {
  const res = await api
    .guest()
    .get<PublishedBook>(`/reader/books/${bookId}`)

  return res.resolver<PublishedBook>()
    .SUCCESS((data) => data)
    .resolve();
}

export const PUBLISHED_BOOK_QUERY_KEY = (bookId: string) => ["published-book", bookId];

export const usePublishedBookQuery = (bookId: string) => {
  const query = useQuery<PublishedBook>({
    queryKey: PUBLISHED_BOOK_QUERY_KEY(bookId),
    queryFn: () => getPublishedBookApi({ bookId })
  });

  return query;
}