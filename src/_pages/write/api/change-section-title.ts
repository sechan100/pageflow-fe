import { EDITOR_SECTION_QUERY_KEY, EditorToc, TocOperations } from "@/entities/editor";
import { api } from "@/global/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { produce } from "immer";
import { useBookContext } from "../model/book-context";
import { useEditorTocStore } from "../model/editor-toc-store";




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
  const toc = useEditorTocStore(s => s.toc);
  const setToc = useEditorTocStore(s => s.setToc);

  const changeNodeTitle = (nodeId: string, title: string) => {
    const newToc = produce<EditorToc>(toc, draft => {
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
        queryClient.invalidateQueries({ queryKey: EDITOR_SECTION_QUERY_KEY(sectionId) });
        changeNodeTitle(sectionId, title);
      }
    }
  });
}