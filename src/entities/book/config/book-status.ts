import { BookStatus } from '..';
import { BookStatusInfo } from "../model/book";




export const bookStatusConfig: Record<BookStatus, BookStatusInfo> = {
  "DRAFT": {
    status: 'DRAFT',
    text: '초안 작성 중',
    color: 'info',
  },
  "PUBLISHED": {
    status: 'PUBLISHED',
    text: '출판 완료',
    color: "primary",
  },
  "REVISING": {
    status: 'REVISING',
    text: '개정 중',
    color: 'warning',
  },
}