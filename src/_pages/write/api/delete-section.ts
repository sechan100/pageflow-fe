import { SECTION_QUERY_KEY, TocOperations, useEditorTocStore, useSectionQuery } from "@/entities/book";
import { api } from "@/global/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { produce } from "immer";
import { useBookContext } from "../model/book-context";


type DeleteSectionForm = {
  bookId: string;
  sectionId: string;
}

type DeleteSectionResult = {
  success: boolean;
  message: string;
}

const deleteSectionApi = async ({ bookId, sectionId }: DeleteSectionForm) => {
  const res = await api
    .user()
    .data({ sectionId })
    .delete(`/user/books/${bookId}/toc/sections/${sectionId}`);

  return res.resolver<DeleteSectionResult>()
    .SUCCESS((data) => ({
      success: true,
      message: res.description
    }))
    .resolve();
}

export const useDeleteSectionMutation = (sectionId: string) => {
  const { id: bookId } = useBookContext();
  const { setIsDeleted } = useSectionQuery(bookId, sectionId);
  const queryClient = useQueryClient();
  const toc = useEditorTocStore(s => s.toc);
  const setToc = useEditorTocStore(s => s.setToc);

  return useMutation({
    mutationFn: () => deleteSectionApi({
      bookId,
      sectionId
    }),
    onSuccess: (res) => {
      if (res.success) {
        // query 삭제
        setIsDeleted(true);
        queryClient.removeQueries({ queryKey: SECTION_QUERY_KEY(sectionId) });

        const newToc = produce(toc, draft => {
          TocOperations.removeNodeMutable(draft, sectionId);
          return draft;
        })
        setToc(newToc);
      }
    }
  });
}
