import { api } from "@/global/api";
import { useQuery } from "@tanstack/react-query";
import { create } from "zustand";
import { EditorFolder } from "../model/folder";



const getEditorFolderApi = async ({ bookId, folderId }: { bookId: string, folderId: string }) => {
  const res = await api
    .user()
    .get<EditorFolder>(`/user/books/${bookId}/toc/folders/${folderId}`);
  if (!res.isSuccess) {
    throw new Error(res.description);
  }
  return res.data;
}

type FolderDeletedStore = {
  deletedFolders: string[];
  addDeletedFolder: (folderId: string) => void;
}
/**
 * 아무리 removeQueries를 해도, 다시 해당 페이가 렌더링되어서 useQuery가 호출되어버림. 하지만 서버 데이터는 삭제되어서 query를 가져올 수 없는 문제등이 발생.
 * isDeleted를 사용하여, 확실하게 useQuery가 호출되지 않도록 설정.
 */
const useFolderDeletedStore = create<FolderDeletedStore>()((set) => ({
  deletedFolders: [],
  addDeletedFolder: (folderId: string) => set(state => ({ deletedFolders: [...state.deletedFolders, folderId] })),
}));

export const EDITOR_FOLDER_QUERY_KEY = (folderId: string) => ['section', folderId];

export const useEditorFolderQuery = (bookId: string, folderId: string) => {
  const deletedFolders = useFolderDeletedStore(s => s.deletedFolders);
  const addDeletedFolder = useFolderDeletedStore(s => s.addDeletedFolder);
  const isDeleted = deletedFolders.includes(folderId);

  const query = useQuery<EditorFolder>({
    queryKey: EDITOR_FOLDER_QUERY_KEY(folderId),
    queryFn: () => getEditorFolderApi({
      bookId,
      folderId
    }),
    enabled: !isDeleted,
  });

  return {
    ...query,
    setFolderDeleted: (folderId: string) => {
      addDeletedFolder(folderId);
    }
  }
}