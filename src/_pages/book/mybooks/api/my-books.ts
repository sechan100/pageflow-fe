import { api } from "@/global/api";
import { decode } from "he";
import { MyBooks } from "../model/my-books";



type Result = {
  code: "success";
  myBooks: MyBooks;
} | {
  code: "error";
  message: string;
}

export const myBooksApi = async (): Promise<Result> => {
  const res = await api
  .user()
  .get<MyBooks>("/user/books");

  return res.resolver<Result>()
  .SUCCESS((data) => {
    const myBooks = {
      ...data,
      books: data.books.map(book => ({
        ...book,
        title: decode(book.title),
      }))
    }

    return {
      code: "success",
      myBooks,
    }
  })
  .resolve();
}