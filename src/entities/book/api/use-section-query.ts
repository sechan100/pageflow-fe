import { api } from "@/global/api";
import { useQuery } from "@tanstack/react-query";
import { Section } from "../model/section.type";
import { useBookStore } from "../model/use-book-store";



const getSectionApi = async ({bookId, sectionId}: {bookId: string, sectionId: string}) => {
  const res = await api
  .user()
  .get<Section>(`/user/books/${bookId}/toc/sections/${sectionId}`);
  if(!res.isSuccess()){
    throw new Error(res.description);
  }
  return res.data;
}


export const SECTION_QUERY_KEY = (sectionId: string) => ['section', sectionId];

export const useSectionQuery = (sectionId: string) => {
  const book = useBookStore(s => s.book);
  const query = useQuery<Section>({
    queryKey: SECTION_QUERY_KEY(sectionId),
    queryFn: () => getSectionApi({
      bookId: book.id,
      sectionId
    })
  });
  
  return query;
}