import { api } from "@/global/api";
import { ReadingBookmark } from "../stores/bookmark-store";

type Form = {
  bookId: string;
  readingBookmark: ReadingBookmark;
}

export const saveReadingBookmarkApi = async ({ bookId, readingBookmark }: Form): Promise<void> => {
  // localStorage.setItem(`bookmark-${bookId}`, JSON.stringify(readingBookmark));
  const res = await api
    .user()
    .data({
      bookId: bookId,
      tocNodeId: readingBookmark.tocNodeId,
      tocNodeType: readingBookmark.tocNodeType,
      sectionContentElementId: readingBookmark.sceId,
    })
    .post<ReadingBookmark>(`/reader/books/${bookId}/bookmark`);

  if (!res.isSuccess()) {
    throw new Error(res.description);
  }
}


type BookmarkRes = {
  isBookmarkExist: boolean;
  bookmark: {
    bookId: string;
    tocNodeId: string;
    tocNodeType: string;
    sectionContentElementId: number;
  } | null;
}
export const getBookmarkOrNullApi = async (bookId: string): Promise<ReadingBookmark | null> => {
  // const bookmark = localStorage.getItem(`bookmark-${bookId}`);
  // if (!bookmark) {
  //   return null;
  // }
  // return JSON.parse(bookmark);
  const res = await api
    .user()
    .get<BookmarkRes>(`/reader/books/${bookId}/bookmark`);
  if (!res.isSuccess()) {
    throw new Error(res.description);
  }
  if (res.data.isBookmarkExist) {
    const serverBookmark = res.data.bookmark;
    if (!serverBookmark) throw new Error("서버에서 북마크를 가져오는 중 오류가 발생했습니다.");
    return {
      tocNodeType: serverBookmark.tocNodeType,
      tocNodeId: serverBookmark.tocNodeId,
      sceId: serverBookmark.sectionContentElementId,
    } as ReadingBookmark;
  } else {
    return null;
  }
}