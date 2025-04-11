import { SvToc } from "@/entities/book";

// 샘플 목차 데이터
export const sampleToc: SvToc = {
  bookId: "sample-book-id",
  root: {
    id: "root-id",
    title: "목차",
    type: "FOLDER",
    children: [
      {
        id: "folder-1",
        title: "1장. 시작",
        type: "FOLDER",
        children: [
          { id: "section-1-1", title: "1.1 소개", type: "SECTION" },
          { id: "section-1-2", title: "1.2 기본 개념", type: "SECTION" }
        ]
      },
      {
        id: "folder-2",
        title: "2장. 이론",
        type: "FOLDER",
        children: [
          { id: "section-2-1", title: "2.1 핵심 이론", type: "SECTION" },
          { id: "section-2-2", title: "2.2 응용 방법", type: "SECTION" },
        ]
      },
      { id: "section-3", title: "3장. 결론", type: "SECTION" }
    ]
  }
};
