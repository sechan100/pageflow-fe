import { api } from "@/global/api";
import { useQuery } from "@tanstack/react-query";
import { create } from "zustand";
import { Folder } from "../model/folder.type";
import { useEditorBookStore } from "../model/use-editor-book-store";



const getFolderApi = async ({ bookId, folderId }: { bookId: string, folderId: string }) => {
  const res = await api
    .user()
    .get<Folder>(`/user/books/${bookId}/toc/folders/${folderId}`);
  if (!res.isSuccess()) {
    throw new Error(res.description);
  }
  return res.data;
}

type FolderDeletedStore = {
  isDeleted: boolean;
}
/**
 * 아무리 removeQueries를 해도, 다시 해당 페이가 렌더링되어서 useQuery가 호출되어버림. 하지만 서버 데이터는 삭제되어서 query를 가져올 수 없는 문제등이 발생.
 * isDeleted를 사용하여, 확실하게 useQuery가 호출되지 않도록 설정.
 */
const useFolderDeletedStore = create<FolderDeletedStore>()((set) => ({
  isDeleted: false
}));

export const FOLDER_QUERY_KEY = (folderId: string) => ['section', folderId];

export const useFolderQuery = (folderId: string) => {
  const book = useEditorBookStore(s => s.book);
  const isDeleted = useFolderDeletedStore(s => s.isDeleted);

  const query = useQuery<Folder>({
    queryKey: FOLDER_QUERY_KEY(folderId),
    queryFn: () => getFolderApi({
      bookId: book.id,
      folderId
    }),
    enabled: !isDeleted,
  });

  return {
    ...query,
    setIsDeleted: (isDeleted: boolean) => {
      useFolderDeletedStore.setState({ isDeleted });
    }
  }
}