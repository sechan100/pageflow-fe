import { api } from "@/global/api";
import { useAuthentication } from "@/global/authentication/authentication";
import { useQuery } from "@tanstack/react-query";


export type SessionUser = {
  uid: string;
  username: string;
  email: string;
  role: string;
  penname: string;
  profileImageUrl: string;
  isEmailVerified: boolean;
}

export type Session = {
  user: SessionUser;
}


const query = async (): Promise<Session> => {
  const res = await api.user().get<Session>("/user/session");
  if (!res.isSuccess) {
    throw new Error(res.description);
  }

  return res.data;
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

