import { api } from "@/global/api";
import { SvToc } from "../model/sv-toc.type";


export const getTocApi = async (bookId: string): Promise<SvToc> => {
  const res = await api
    .user()
    .get<SvToc>(`/user/books/${bookId}/toc`);

  if (!res.isSuccess()) {
    throw new Error(res.description);
  }

  return res.data;
};