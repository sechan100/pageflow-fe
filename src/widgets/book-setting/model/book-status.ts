import { BookStatus } from "@/entities/book";

export type BookStatusInfo = {
  status: BookStatus;
  text: string;
  color: string;
}