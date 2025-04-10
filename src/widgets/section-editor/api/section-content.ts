import { getSectionContentApi } from "@/entities/book";
import { useQuery } from "@tanstack/react-query";



export const SECTION_CONTENT_QUERY_KEY = (sectionId: string) => ['editor', 'section', sectionId, 'content'];

export const useSectionContentQuery = (bookId: string, sectionId: string) => {
  const contentQuery = useQuery<{ content: string }>({
    queryKey: SECTION_CONTENT_QUERY_KEY(sectionId),
    queryFn: () => getSectionContentApi({
      bookId: bookId,
      sectionId
    })
  });

  return contentQuery;
}