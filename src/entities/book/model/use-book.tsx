import { createStoreContext } from "@/shared/zustand/create-store-context";
import { BookWithAuthor } from "./book.type";




type BookStore = {
  book: BookWithAuthor;
}

export const [BookStoreProvider, useBookStore] = createStoreContext<BookWithAuthor, BookStore>((book, set) => ({
  book,
}))