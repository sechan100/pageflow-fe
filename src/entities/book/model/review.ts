import { LocalDateTimeArray } from "@/shared/local-date-time";
import { Author } from "./author.type";


export type Review = {
  id: string;
  writer: Author;
  content: string;
  score: number;
  createdAt: LocalDateTimeArray;
  updatedAt: LocalDateTimeArray;
}