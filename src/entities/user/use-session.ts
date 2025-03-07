import { accessTokenManager } from "@/global/authentication/access-token-manager";
import { useAuthentication } from "@/global/authentication/use-authentication";
import { useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { useCallback } from "react";
import { LoginResult, requestLogin } from "./login";
import { SESSION_QUERY_KEY, useSessionQuery } from "./use-session-query";
import { api } from "@/global/api";


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

  

export type UseSession = {
  session: Session | null;
  sessionQueryResult: UseQueryResult<Session>;
  login: (username: string, password: string) => Promise<LoginResult>;
  logout: () => void;
}

export const useSession = (): UseSession => {
  const queryClient = useQueryClient();
  const sessionQuery = useSessionQuery();

  const login = useCallback(async (username: string, password: string) => {
    return await requestLogin(username, password);
  }, []);

  const logout = useCallback(async () => {
    const res = await api.guest().post("/auth/logout");
    if(!res.isSuccess()){
      throw new Error("로그아웃에 실패했습니다.");
    }
    accessTokenManager.clearToken();
    queryClient.removeQueries({ queryKey: SESSION_QUERY_KEY });
    useAuthentication.getState().deAuthenticate();
  }, []);

  return {
    session: sessionQuery.data??null,
    sessionQueryResult: sessionQuery,
    login,
    logout
  }

}