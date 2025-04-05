import { BookWithAuthor } from "@/entities/book";
import { createDataContext } from "@/shared/context";

export const [BookContextProvider, useBook] = createDataContext<BookWithAuthor>();