import { api } from "@/global/api";
import { accessTokenManager } from "@/global/authentication/access-token-manager";
import { AccessToken } from "@/global/authentication/AccessToken";
import { useAuthentication } from "@/global/authentication/authentication";


export type LoginResult =
  {
    code: "success";
  } | {
    code: "error";
    message: string;
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
    .BAD_CREDENTIALS(() => ({
      code: "error",
      message: "입력하신 정보가 일치하지 않습니다. 다시 확인해주세요."
    }));

  return resolver.resolve();
};
