import { BookStatus } from "@/entities/book";
import { STYLES } from "@/global/styles";
import { BookStatusInfo } from "../model/book-status";




export const bookStatusConfig: Record<BookStatus, BookStatusInfo> = {
  "DRAFT": {
    status: 'DRAFT',
    text: '초안 작성 중',
    color: '#00e6ea',
  },
  "PUBLISHED": {
    status: 'PUBLISHED',
    text: '출판됨',
    color: STYLES.color.primary,
  },
  "REVISING": {
    status: 'REVISING',
    text: '개정 중',
    color: '#ea9200',
  },
}