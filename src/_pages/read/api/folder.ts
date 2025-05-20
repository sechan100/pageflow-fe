import { api } from "@/global/api";
import { ReadableFolderContent } from "../model/readable-content";



type Form = {
  bookId: string;
  folderId: string;
}

export const getReadableFolderContentApi = async ({ bookId, folderId }: Form) => {
  const res = await api
    .guest()
    .get<ReadableFolderContent>(`/reader/books/${bookId}/folders/${folderId}`);
  if (!res.isSuccess) {
    throw new Error(res.description);
  }
  return res.data;
}