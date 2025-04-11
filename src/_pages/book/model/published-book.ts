import { Author } from "@/entities/book";






export type PublishedBook = {
  id: string;
  title: string;
  coverImageUrl: string;
  description: string;
  edition: number;
  author: Author;
}