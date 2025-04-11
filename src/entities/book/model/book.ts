import { MUIColor } from "@/shared/ui/mui-color";
import { Author } from "./author.type";

export type BookStatus = 'DRAFT' | 'PUBLISHED' | 'REVISING';

export type BookStatusInfo = {
  status: BookStatus;
  text: string;
  color: MUIColor;
};


export type BookVisibility = 'GLOBAL' | 'PERSONAL';

export type Book = {
  id: string;
  title: string;
  coverImageUrl: string;
  description: string;
  status: BookStatus;
  edition: number;
  visibility: BookVisibility;
  authorId: string;
}

export type BookWithAuthor = {
  id: string;
  title: string;
  coverImageUrl: string;
  description: string;
  status: BookStatus;
  edition: number;
  visibility: BookVisibility;
  author: Author;
}