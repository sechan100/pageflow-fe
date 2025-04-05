import { api } from "@/global/api";
import { useQuery } from "@tanstack/react-query";
import { decode } from "he";
import { BookWithAuthor } from '../model/book';


type Result = {
  code: "success",
  book: BookWithAuthor
} | {
  code: "error",
  message: string
}

const getBookApi = async (bookId: string): Promise<Result> => {
  const res = await api
    .user()
    .get<BookWithAuthor>(`/user/books/${bookId}`);

  return res.resolver<Result>()
    .SUCCESS((data) => {
      const book: BookWithAuthor = {
        ...data,
        title: decode(data.title),
        description: decode(data.description),
        author: {
          ...data.author,
          penname: decode(data.author.penname),
        }
      }

      return {
        code: "success",
        book,
      }
    })
    .resolve();
}

export const EDITOR_BOOK_QUERY_KEY = (bookId: string) => ['editor-book', bookId];

export const useEditorBookQuery = (bookId: string) => {
  const query = useQuery({
    queryKey: EDITOR_BOOK_QUERY_KEY(bookId),
    queryFn: () => getBookApi(bookId)
  });

  return query;
}