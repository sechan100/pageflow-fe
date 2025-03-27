import { SectionWithContent, useBookStore } from "@/entities/book";
import { api } from "@/global/api";
import { useQuery } from "@tanstack/react-query";
import { decode } from "he";



const getSectionContentApi = async ({bookId, sectionId}: {bookId: string, sectionId: string}): Promise<SectionWithContent> => {
  const res = await api
  .user()
  .get<SectionWithContent>(`/user/books/${bookId}/toc/sections/${sectionId}/content`);

  if(!res.isSuccess()){
    throw new Error(res.description);
  }

  return {
    ...res.data,
    content: decode(res.data.content)
  }
}

export const EDITOR_SECTION_CONTENT_QUERY_KEY = (sectionId: string) => ['editor', 'section', sectionId, 'content'];

export const useEditorSectionContentQuery = (sectionId: string) => {
  const book = useBookStore(s => s.book);
  const query = useQuery<SectionWithContent>({
    queryKey: EDITOR_SECTION_CONTENT_QUERY_KEY(sectionId),
    queryFn: () => getSectionContentApi({
      bookId: book.id,
      sectionId
    })
  });

  return query;
}