import { useAuthentication } from "@/global/authentication/authentication";
import { useQuery } from "@tanstack/react-query";
import { SvToc } from "../model/toc.type";
import { getTocApi } from "./get-toc";




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