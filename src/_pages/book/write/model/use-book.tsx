import { BookWithAuthor } from "@/entities/book";
import { createStoreContext } from "@/shared/zustand/create-store-context";




type BookStore = {
  book: BookWithAuthor;
}

export const [BookStoreProvider, useBookStore] = createStoreContext<BookWithAuthor, BookStore>((book, set) => ({
  book,
}))