import { api } from "@/global/api";
import { useQuery } from "@tanstack/react-query";
import { Folder } from "../model/folder.type";
import { useEditorBookStore } from "../model/use-editor-book-store";



const getFolderApi = async ({bookId, folderId}: {bookId: string, folderId: string}) => {
  const res = await api
  .user()
  .get<Folder>(`/user/books/${bookId}/toc/folders/${folderId}`);
  if(!res.isSuccess()){
    throw new Error(res.description);
  }
  return res.data;
}


export const FOLDER_QUERY_KEY = (folderId: string) => ['section', folderId];

export const useFolderQuery = (folderId: string) => {
  const book = useEditorBookStore(s => s.book);
  const query = useQuery<Folder>({
    queryKey: FOLDER_QUERY_KEY(folderId),
    queryFn: () => getFolderApi({
      bookId: book.id,
      folderId
    })
  });
  
  return query;
}