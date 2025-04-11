import { SimpleBook } from "@/entities/book"
import { api } from "@/global/api"


type Form = {
  title: string
}


export const createBookApi = async (form: Form): Promise<SimpleBook> => {
  const res = await api
    .user()
    .data(form)
    .post<SimpleBook>("/user/books");

  return res.resolver<SimpleBook>()
    .SUCCESS(book => book)
    .resolve();
}