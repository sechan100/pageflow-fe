import { api } from "@/global/api";
import { useQuery } from "@tanstack/react-query";
import { decode } from "he";
import { AuthorPrivateBook } from '../model/book';


type Result = {
  code: "success",
  book: AuthorPrivateBook
} | {
  code: "error",
  message: string
}

const getBookApi = async (bookId: string): Promise<Result> => {
  const res = await api
    .user()
    .get<AuthorPrivateBook>(`/user/books/${bookId}`);

  return res.resolver<Result>()
    .SUCCESS((data) => {
      const book: AuthorPrivateBook = {
        ...data,
        title: decode(data.title),
        description: decode(data.description),
      }

      return {
        code: "success",
        book,
      }
    })
    .resolve();
}

export const BOOK_QUERY_KEY = (bookId: string) => ['book', bookId];

/**
 * 작가가 자신의 책을 불러올 때, 다양한 상태를 포함해서 불러오는 query
 */
export const useBookQuery = (bookId: string) => {
  const query = useQuery({
    queryKey: BOOK_QUERY_KEY(bookId),
    queryFn: () => getBookApi(bookId)
  });

  return query;
}