import { BookWithAuthor } from "@/entities/book";
import { api } from "@/global/api";







export const getBookApi = async (bookId: string): Promise<BookWithAuthor> => {
  const res = await api
  .user()
  .get<BookWithAuthor>(`/user/books/${bookId}`);

  if(!res.isSuccess()){
    throw new Error(res.description);
  }

  return res.data;
}