import { createStoreContext } from "@/shared/zustand/create-store-context";
import { BookWithAuthor } from "./book.type";




type EditorBookStore = {
  book: BookWithAuthor;
}

export const [EditorBookStoreProvider, useEditorBookStore] = createStoreContext<BookWithAuthor, EditorBookStore>((book, set) => ({
  book,
}))