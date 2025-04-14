import { MUIColor } from "@/shared/ui/mui-color";

export type BookStatus = 'DRAFT' | 'PUBLISHED' | 'REVISING';

export type BookStatusInfo = {
  status: BookStatus;
  text: string;
  color: MUIColor;
};

export type BookVisibility = 'GLOBAL' | 'PERSONAL';

export type SimpleBook = {
  id: string;
  title: string;
  coverImageUrl: string;
}

/**
 * 작가에게만 보여지는 책 정보
 */
export type AuthorPrivateBook = {
  id: string;
  title: string;
  coverImageUrl: string;
  description: string;
  status: BookStatus;
  visibility: BookVisibility;
}