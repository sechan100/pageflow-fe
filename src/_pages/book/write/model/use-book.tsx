import { BookWithAuthor } from "@/entities/book";
import { createStoreContext } from "@/shared/zustand/create-store-context";




type UseBook = {
  book: BookWithAuthor;
}

export const [UseBookProvider, useBook] = createStoreContext<BookWithAuthor, UseBook>((book, set) => ({
  book,
}))