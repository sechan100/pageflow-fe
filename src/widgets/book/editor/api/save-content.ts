import { useBookStore } from "@/entities/book";
import { api } from "@/global/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SECTION_CONTENT_QUERY_KEY } from "./section-content";









// lexical에서 html 형식으로 직렬화한 section content type
export type LexicalHtmlSerializedState = string;

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

export const useSaveContentMutation = (sectionId: string) => {
  const book = useBookStore(s => s.book);
  const sectionContentQueryKey = SECTION_CONTENT_QUERY_KEY(sectionId);
  const queryClient = useQueryClient();

  return useMutation({
      mutationFn: ({ html }: { html: LexicalHtmlSerializedState }) => sectionContentSaveApi({
        bookId: book.id,
        sectionId,
        html
      }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: sectionContentQueryKey});
      }
    }
  );
}