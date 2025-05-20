import { Author } from "@/entities/book";




export type PublishedListBook = {
  id: string;
  title: string;
  coverImageUrl: string;
  author: Author;
}