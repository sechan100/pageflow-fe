import { BookStatus } from "@/entities/book";


export type MyBook = {
  id: string;
  title: string;
  coverImageUrl: string;
  status: BookStatus;
}

export type MyBooks = {
  books: MyBook[];
}