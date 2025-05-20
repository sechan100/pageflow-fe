import { api } from "@/global/api";
import { EditorToc } from "../model/toc";


export const getEditorTocApi = async (bookId: string): Promise<EditorToc> => {
  const res = await api
    .user()
    .get<EditorToc>(`/user/books/${bookId}/toc`);

  if (!res.isSuccess) {
    throw new Error(res.description);
  }

  return res.data;
};