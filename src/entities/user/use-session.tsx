import { api } from "@/global/api";
import { accessTokenManager } from "@/global/authentication/access-token-manager";
import { AccessToken } from "@/global/authentication/AccessToken";
import { useAuthentication } from "@/global/authentication/use-authentication";
import { FieldValidationResult } from "@/global/field-validation";
import { Result } from "neverthrow";
import { SESSION_QUERY_KEY, useSessionQuery } from "./use-session-query";
import { useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { useCallback } from "react";


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
  login: (username: string, password: string) => Promise<Result<true, FieldValidationResult>>;
  logout: () => void;
}

export const useSession = () => {
  const queryClient = useQueryClient();
  const sessionQuery = useSessionQuery();

  const login = useCallback(async (username: string, password: string) => {
    const response = await api.guest()
      .params({ username, password})
      .post<AccessToken>("/auth/login");
  
    const resolver = response.resolver()
      .USER_NOT_FOUND()
      .BAD_CREDENTIALS()
      .SUCCESS(accessToken => {
        // authentication state를 업데이트
        useAuthentication.getState().authenticate();
        // accessTokenManager에 토큰 저장
        accessTokenManager.storeToken(accessToken);
      })

    return resolver.resolveGet(true);
  }, []);


  const logout = useCallback(() => {
    accessTokenManager.clearToken();
    queryClient.removeQueries({ queryKey: SESSION_QUERY_KEY });
    useAuthentication.getState().deAuthenticate();
  }, []);

  return {
    session: sessionQuery.data,
    sessionQueryResult: sessionQuery,
    login,
    logout
  }

}