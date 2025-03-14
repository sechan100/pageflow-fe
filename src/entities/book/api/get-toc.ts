import { api } from "@/global/api";
import { Toc } from "../model/toc.type";





export const getTocApi = async (bookId: string): Promise<Toc> => {
  const res = await api
  .user()
  .get<Toc>(`/user/books/${bookId}/toc`);

  if(!res.isSuccess()){
    throw new Error(res.description);
  }

  return res.data;
}