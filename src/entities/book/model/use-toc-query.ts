import { useAuthentication } from "@/global/authentication/authentication";
import { useQuery } from "@tanstack/react-query";
import { getTocApi } from "../api/get-toc";
import { SvToc } from "./toc.type";




export const GET_TOC_QUERY_KEY = (bookId: string) => ['toc', bookId];


export const useTocQuery = (bookId: string) => {
  const { isAuthenticated } = useAuthentication();

  const query = useQuery({
    queryKey: GET_TOC_QUERY_KEY(bookId),
    queryFn: () => getTocApi(bookId),
    enabled: isAuthenticated
  });

  return {
    ...query,
    toc: query.data as SvToc
  }
}