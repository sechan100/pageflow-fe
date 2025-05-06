import { ReadingBookmark } from "../ui/container/reading-bookmark";

type Form = {
  bookId: string;
  readingBookmark: ReadingBookmark;
}

export const saveReadingBookmarkApi = async ({ bookId, readingBookmark }: Form): Promise<void> => {
  localStorage.setItem(`bookmark-${bookId}`, JSON.stringify(readingBookmark));
  // const res = await api
  //   .guest()
  //   .get<ReadableSectionContent>(`/reader/books/${bookId}/sections/${sectionId}`);
  // if (!res.isSuccess()) {
  //   throw new Error(res.description);
  // }
  // return {
  //   ...res.data,
  //   content: decode(res.data.content),
  // }
}

export const getReadingBookmarkApi = async (bookId: string): Promise<ReadingBookmark | null> => {
  const bookmark = localStorage.getItem(`bookmark-${bookId}`);
  if (!bookmark) {
    return null;
  }
  return JSON.parse(bookmark);
}