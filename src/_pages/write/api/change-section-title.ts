import { SECTION_QUERY_KEY, Toc, TocOperations, useTocStore } from "@/entities/book";
import { api } from "@/global/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { produce } from "immer";
import { useBookContext } from "../model/book-context";




type Form = {
  bookId: string;
  sectionId: string;
  title: string;
}

type ChangeSectionTitleResult = {
  success: boolean;
  message: string;
}

const changeSectionTitleApi = async ({ bookId, sectionId, title }: Form) => {
  const res = await api
    .user()
    .data({ title })
    .post(`/user/books/${bookId}/toc/sections/${sectionId}`);


  return res.resolver<ChangeSectionTitleResult>()
    .SUCCESS((data) => ({
      success: true,
      message: res.description
    }))
    .resolve();
}

export const useSectionTitleMutation = (sectionId: string) => {
  const { id: bookId } = useBookContext();
  const queryClient = useQueryClient();
  const toc = useTocStore(s => s.toc);
  const setToc = useTocStore(s => s.setToc);

  const changeNodeTitle = (nodeId: string, title: string) => {
    const newToc = produce<Toc>(toc, draft => {
      const targetNode = TocOperations.findNode(draft, nodeId);
      targetNode.title = title;
      return draft;
    });
    setToc(newToc);
  }

  return useMutation({
    mutationFn: (title: string) => changeSectionTitleApi({
      bookId,
      sectionId,
      title
    }),
    onSuccess: (res, title) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: SECTION_QUERY_KEY(sectionId) });
        changeNodeTitle(sectionId, title);
      }
    }
  });
}