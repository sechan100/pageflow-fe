import { Author } from "./author.type";



export type Book = {
  id: string;
  title: string;
  coverImageUrl: string;
  authorId: string;
}

export type BookWithAuthor = {
  id: string;
  title: string;
  coverImageUrl: string;
  author: Author;
}