import { api } from "@/global/api";
import { useQuery } from "@tanstack/react-query";
import { useAuthentication } from "@/global/authentication/authentication";
import { accessTokenManager } from "@/global/authentication/access-token-manager";


export type SessionUser = {
  uid: string;
  username: string;
  email: string;
  role: string;
  penname: string;
  profileImageUrl: string;
  emailVerified: boolean;
}

export type Session = {
  user: SessionUser;
}


const query = async (): Promise<Session> => {
  const res = await api.user().get<Session>("/user/session");
  return res.resolver().get();
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

