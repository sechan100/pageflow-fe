import { FOLDER_QUERY_KEY, TocOperations, useEditorTocStore, useFolderQuery } from "@/entities/book";
import { api } from "@/global/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { produce } from "immer";
import { useBookContext } from "../model/book-context";


type DeleteFolderForm = {
  bookId: string;
  folderId: string;
}

type DeleteFolderResult = {
  success: boolean;
  message: string;
}

const deleteFolderApi = async ({ bookId, folderId }: DeleteFolderForm) => {
  const res = await api
    .user()
    .data({ folderId })
    .delete(`/user/books/${bookId}/toc/folders/${folderId}`);

  return res.resolver<DeleteFolderResult>()
    .SUCCESS((data) => ({
      success: true,
      message: res.description
    }))
    .resolve();
}

export const useDeleteFolderMutation = (folderId: string) => {
  const { id: bookId } = useBookContext();
  const { setIsDeleted } = useFolderQuery(bookId, folderId);
  const queryClient = useQueryClient();
  const toc = useEditorTocStore(s => s.toc);
  const setToc = useEditorTocStore(s => s.setToc);

  return useMutation({
    mutationFn: () => deleteFolderApi({
      bookId,
      folderId
    }),
    onSuccess: (res) => {
      if (res.success) {
        // query 삭제
        queryClient.removeQueries({ queryKey: FOLDER_QUERY_KEY(folderId) });
        setIsDeleted(true);

        const newToc = produce(toc, draft => {
          TocOperations.removeNodeMutable(draft, folderId);
          return draft;
        })
        setToc(newToc);
      }
    }
  });
}
