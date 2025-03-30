import { Book } from "@/entities/book"
import { api } from "@/global/api"


type Form = {
  title: string
}


export const createBookApi = async (form: Form): Promise<Book> => {
  const res = await api
  .user()
  .data(form)
  .post<Book>("/user/books");

  return res.resolver<Book>()
  .SUCCESS(book => book)
  .resolve();
}