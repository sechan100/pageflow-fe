import { Author } from "./author.type";


export type Review = {
  id: string;
  writer: Author;
  content: string;
  score: number;
  createdAt: string;
  updatedAt: string;
}