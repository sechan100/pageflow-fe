import { api } from "@/global/api";
import { useQuery } from "@tanstack/react-query";
import { create } from "zustand";
import { Section } from "../model/section.type";



const getSectionApi = async ({ bookId, sectionId }: { bookId: string, sectionId: string }) => {
  const res = await api
    .user()
    .get<Section>(`/user/books/${bookId}/toc/sections/${sectionId}`);
  if (!res.isSuccess()) {
    throw new Error(res.description);
  }
  return res.data;
}

type SectionDeletedStore = {
  isDeleted: boolean;
}
/**
 * 아무리 removeQueries를 해도, 다시 해당 페이가 렌더링되어서 useQuery가 호출되어버림. 하지만 서버 데이터는 삭제되어서 query를 가져올 수 없는 문제등이 발생.
 * isDeleted를 사용하여, 확실하게 useQuery가 호출되지 않도록 설정.
 */
const useSectionDeletedStore = create<SectionDeletedStore>()((set) => ({
  isDeleted: false
}));

export const SECTION_QUERY_KEY = (sectionId: string) => ['section', sectionId];

export const useSectionQuery = (bookId: string, sectionId: string) => {
  const isDeleted = useSectionDeletedStore(s => s.isDeleted);
  const query = useQuery<Section>({
    queryKey: SECTION_QUERY_KEY(sectionId),
    queryFn: () => getSectionApi({
      bookId,
      sectionId
    }),
    enabled: !isDeleted,
  });

  return {
    ...query,
    setIsDeleted: (isDeleted: boolean) => {
      useSectionDeletedStore.setState({ isDeleted });
    }
  }
}