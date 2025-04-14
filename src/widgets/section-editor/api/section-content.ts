import { api } from "@/global/api";
import { useQuery } from "@tanstack/react-query";
import { decode } from "he";

type EditorSectionContent = {
  content: string;
}

export const getEditorSectionContentApi = async ({ bookId, sectionId }: { bookId: string; sectionId: string; }): Promise<EditorSectionContent> => {
  const res = await api
    .user()
    .get<EditorSectionContent>(`/user/books/${bookId}/toc/sections/${sectionId}/content`);

  if (!res.isSuccess()) {
    throw new Error(res.description);
  }

  return {
    content: decode(res.data.content)
  };
};

export const EDITOR_SECTION_CONTENT_QUERY_KEY = (sectionId: string) => ['editor', 'section', sectionId, 'content'];

export const useEditorSectionContentQuery = (bookId: string, sectionId: string) => {
  const contentQuery = useQuery<{ content: string }>({
    queryKey: EDITOR_SECTION_CONTENT_QUERY_KEY(sectionId),
    queryFn: () => getEditorSectionContentApi({
      bookId: bookId,
      sectionId
    })
  });

  return contentQuery;
}