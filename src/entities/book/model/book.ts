import { Author } from "./author";



export type Book = {
  id: string;
  title: string;
  coverImageUrl: string;
  authorId: string;
}

export type BookWithAuthor = Book & {
  author: Author;
}