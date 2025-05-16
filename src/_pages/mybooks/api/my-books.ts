import { api } from "@/global/api";
import { useQuery } from "@tanstack/react-query";
import { MyBooks } from "../model/my-books";



type Result = {
  code: "success";
  myBooks: MyBooks;
} | {
  code: "error";
  message: string;
}

const myBooksApi = async (): Promise<Result> => {
  const res = await api
    .user()
    .get<MyBooks>("/user/books");

  return res.resolver<Result>()
    .SUCCESS((myBooks) => ({
      code: "success",
      myBooks,
    }))
    .resolve();
}

export const MY_BOOKS_QUERY_KEY = ['mybooks'];

export const useMyBooksQuery = () => {
  const query = useQuery({
    queryKey: MY_BOOKS_QUERY_KEY,
    queryFn: myBooksApi,
  })

  return query;
}