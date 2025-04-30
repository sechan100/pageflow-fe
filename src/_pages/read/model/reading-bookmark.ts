import { ReadableTocNodeType } from "@/entities/book"


export type ReadingBookmark = {
  tocNodeType: ReadableTocNodeType;
  tocNodeId: string;

  // 0부터 시작하는 section content element들의 번호
  sceId: number;
}