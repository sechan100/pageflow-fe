import { getSectionContentApi, useEditorBookStore } from "@/entities/book";
import { useQuery } from "@tanstack/react-query";



export const SECTION_CONTENT_QUERY_KEY = (sectionId: string) => ['editor', 'section', sectionId, 'content'];

export const useSectionContentQuery = (sectionId: string) => {
  const book = useEditorBookStore(s => s.book);
  const contentQuery = useQuery<{ content: string}>({
    queryKey: SECTION_CONTENT_QUERY_KEY(sectionId),
    queryFn: () => getSectionContentApi({
      bookId: book.id,
      sectionId
    })
  });

  return contentQuery;
}