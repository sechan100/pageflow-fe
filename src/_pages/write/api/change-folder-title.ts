import { FOLDER_QUERY_KEY, Toc, TocOperations, useEditorTocStore } from "@/entities/book";
import { api } from "@/global/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { produce } from "immer";
import { useBookContext } from "../model/book-context";




type Form = {
  bookId: string;
  folderId: string;
  title: string;
}

type ChangeFolderTitleResult = {
  success: boolean;
  message: string;
}

const changeFolderTitleApi = async ({ bookId, folderId, title }: Form) => {
  const res = await api
    .user()
    .data({ title })
    .post(`/user/books/${bookId}/toc/folders/${folderId}`);


  return res.resolver<ChangeFolderTitleResult>()
    .SUCCESS((data) => ({
      success: true,
      message: res.description
    }))
    .resolve();
}

export const useFolderTitleMutation = (folderId: string) => {
  const { id: bookId } = useBookContext();
  const queryClient = useQueryClient();
  const toc = useEditorTocStore(s => s.toc);
  const setToc = useEditorTocStore(s => s.setToc);

  const changeNodeTitle = (nodeId: string, title: string) => {
    const newToc = produce<Toc>(toc, draft => {
      const targetNode = TocOperations.findNode(draft, nodeId);
      targetNode.title = title;
      return draft;
    });
    setToc(newToc);
  }

  return useMutation({
    mutationFn: (title: string) => changeFolderTitleApi({
      bookId,
      folderId,
      title
    }),
    onSuccess: (res, title) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: FOLDER_QUERY_KEY(folderId) });
        changeNodeTitle(folderId, title);
      }
    }
  });
}