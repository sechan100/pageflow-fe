import { api } from "@/global/api";
import { LexicalHtmlSerializedState } from "@/shared/lexical/$getHtmlSerializedEditorState";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SECTION_CONTENT_QUERY_KEY } from "./section-content";


type Result = {
  success: true,
} | {
  success: false,
  message: string
}

type Form = {
  bookId: string,
  sectionId: string,
  html: LexicalHtmlSerializedState
}
const sectionContentSaveApi = async ({ bookId, sectionId, html }: Form): Promise<Result> => {
  const res = await api
    .user()
    .data({ content: html })
    .post(`/user/books/${bookId}/toc/sections/${sectionId}/content`);

  return res.resolver<Result>()
    .SUCCESS(() => ({ success: true }))
    .defaultHandler(() => ({ success: false, message: res.description }))
    .resolve();
}

export const useSaveContentMutation = (bookId: string, sectionId: string) => {
  const sectionContentQueryKey = SECTION_CONTENT_QUERY_KEY(sectionId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ html }: { html: LexicalHtmlSerializedState }) => sectionContentSaveApi({
      bookId,
      sectionId,
      html
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sectionContentQueryKey });
    }
  }
  );
}