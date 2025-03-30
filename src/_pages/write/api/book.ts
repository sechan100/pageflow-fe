import { BookWithAuthor } from "@/entities/book";
import { api } from "@/global/api";
import { decode } from "he";





type Result = {
  code: "success",
  book: BookWithAuthor
} | {
  code: "error",
  message: string
}



export const getBookApi = async (bookId: string): Promise<Result> => {
  const res = await api
  .user()
  .get<BookWithAuthor>(`/user/books/${bookId}`);
  
  return res.resolver<Result>()
  .SUCCESS((data) => {
    const book = {
      ...data,
      title: decode(data.title),
    }

    return {
      code: "success",
      book,
    }
  })
  .resolve();
}