import { ReadOnlyFolder } from "@/entities/reader";
import { api } from "@/global/api";
import { useQuery } from "@tanstack/react-query";



type Form = {
  bookId: string;
  folderId: string;
}

const getFolderApi = async ({ bookId, folderId }: Form) => {
  const res = await api
    .guest()
    .get<ReadOnlyFolder>(`/reader/books/${bookId}/folders/${folderId}`);
  if (!res.isSuccess()) {
    throw new Error(res.description);
  }
  return res.data;
}

export const READ_ONLY_FOLDER_QUERY_KEY = (folderId: string) => ['folder', folderId];

export const useReadOnlyFolderQuery = ({ bookId, folderId }: Form) => {
  const query = useQuery({
    queryKey: READ_ONLY_FOLDER_QUERY_KEY(folderId),
    queryFn: () => getFolderApi({ bookId, folderId }),
  });

  return {
    ...query,
  }
}
