import { api } from "@/global/api";
import { useQuery } from "@tanstack/react-query";
import { ReadableFolder } from "../model/readable-folder";



type Form = {
  bookId: string;
  folderId: string;
}

const getFolderApi = async ({ bookId, folderId }: Form) => {
  const res = await api
    .guest()
    .get<ReadableFolder>(`/reader/books/${bookId}/folders/${folderId}`);
  if (!res.isSuccess()) {
    throw new Error(res.description);
  }
  return res.data;
}

export const READABLE_FOLDER_QUERY_KEY = (folderId: string) => ['reader', 'folder', folderId];

export const useReadableFolderQuery = ({ bookId, folderId }: Form) => {
  const query = useQuery({
    queryKey: READABLE_FOLDER_QUERY_KEY(folderId),
    queryFn: () => getFolderApi({ bookId, folderId }),
  });

  return {
    ...query,
  }
}
