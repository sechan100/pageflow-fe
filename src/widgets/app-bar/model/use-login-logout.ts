import { accessTokenManager } from "@/global/authentication/access-token-manager";
import { useAuthentication } from "@/global/authentication/authentication";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { SESSION_QUERY_KEY } from '@/entities/user';
import { api } from "@/global/api";
import { LoginResult, requestLogin } from "../api/login";


export type UseLoginLogout = {
  login: (username: string, password: string) => Promise<LoginResult>;
  logout: () => void;
}


export const useLoginLogout = (): UseLoginLogout => {
  const queryClient = useQueryClient();

  const login = useCallback(async (username: string, password: string) => {
    return await requestLogin(username, password);
  }, []);

  const logout = useCallback(async () => {
    const res = await api.guest().post("/auth/logout");
    if (!res.isSuccess()) {
      throw new Error("로그아웃에 실패했습니다.");
    }
    accessTokenManager.clearToken();
    queryClient.removeQueries({ queryKey: SESSION_QUERY_KEY });
    useAuthentication.getState().deAuthenticate();
  }, [queryClient]);

  return {
    login,
    logout
  }
}