import { api } from "@/global/api";
import { decode } from "he";


type SectionContent = {
  content: string;
}

export const getSectionContentApi = async ({ bookId, sectionId }: { bookId: string; sectionId: string; }): Promise<SectionContent> => {
  const res = await api
    .user()
    .get<SectionContent>(`/user/books/${bookId}/toc/sections/${sectionId}/content`);

  if (!res.isSuccess()) {
    throw new Error(res.description);
  }

  return {
    content: decode(res.data.content)
  };
};
