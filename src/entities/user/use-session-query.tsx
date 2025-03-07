import { api } from "@/global/api";
import { Session } from "./use-session";
import { useQuery } from "@tanstack/react-query";
import { useAuthentication } from "@/global/authentication/use-authentication";


const query = async (): Promise<Session> => {
  const res = await api.user().get<Session>("/user/session");
  return res.resolver().getSuccessData();
}


export const SESSION_QUERY_KEY = ["session"];
export const useSessionQuery = () => {
  const { isAuthenticated } = useAuthentication();

  return useQuery<Session>({
    queryKey: SESSION_QUERY_KEY,
    queryFn: query,
    enabled: isAuthenticated
  })
}

