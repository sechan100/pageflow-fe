import { accessTokenManager } from "@/global/authentication/access-token-manager";
import { useAuthentication } from "@/global/authentication/authentication";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { SESSION_QUERY_KEY } from "./use-session-query";
import { api } from "@/global/api";
import { AccessToken } from "@/global/authentication/AccessToken";
import { FieldValidationResult, fromInvalidField } from "@/shared/field-validation";


export type LoginResult =
{
  code: "success";
} | {
  code: "field-error";
  fieldValidationResult: FieldValidationResult;
} | {
  code: "already-logined";
  message: string;
};


export const requestLogin = async (username: string, password: string): Promise<LoginResult> => {
  const isAuthed = useAuthentication.getState().isAuthenticated;
  // 이미 인증정보가 있음
  if (isAuthed) {
    return { code: "already-logined", message: "이미 로그인 중입니다." };
  }

  const response = await api
    .guest()
    .params({ username, password })
    .post<AccessToken>("/auth/login");

  const resolver = response.resolver<LoginResult>()
    .SUCCESS(accessToken => {
      // authentication state를 업데이트
      useAuthentication.getState().authenticate();
      // accessTokenManager에 토큰 저장
      accessTokenManager.storeToken(accessToken);
      return { code: "success" };
    })
    .USER_NOT_FOUND(() => ({
      code: "field-error",
      fieldValidationResult: fromInvalidField({
        field: "username",
        message: "존재하지 않는 사용자입니다."
      })
    }))
    .BAD_CREDENTIALS(() => ({
      code: "field-error",
      fieldValidationResult: fromInvalidField({
        field: "password",
        message: "비밀번호가 일치하지 않습니다."
      })
    }));

  return resolver.resolve();
};


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
    if(!res.isSuccess()){
      throw new Error("로그아웃에 실패했습니다.");
    }
    accessTokenManager.clearToken();
    queryClient.removeQueries({ queryKey: SESSION_QUERY_KEY });
    useAuthentication.getState().deAuthenticate();
  }, []);

  return {
    login,
    logout
  }
}