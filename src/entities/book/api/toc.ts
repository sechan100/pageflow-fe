import { api } from "@/global/api";
import { useQuery } from "@tanstack/react-query";
import { SvToc } from "../model/sv-toc.type";


const getTocApi = async (bookId: string): Promise<SvToc> => {
  const res = await api
    .user()
    .get<SvToc>(`/user/books/${bookId}/toc`);

  if (!res.isSuccess()) {
    throw new Error(res.description);
  }

  return res.data;
};

export const TOC_QUERY_KEY = (bookId: string) => ['toc', bookId];

export const useTocQuery = (bookId: string) => {
  const query = useQuery<SvToc>({
    queryKey: TOC_QUERY_KEY(bookId),
    queryFn: () => getTocApi(bookId),
  });

  return query;
};