import { api } from "@/global/api"
import { MyBooks } from "../model/my-books"



export const myBooksApi = async (): Promise<MyBooks> => {
  const res = await api
  .user()
  .get<MyBooks>("/user/books");

  return res.data;
}