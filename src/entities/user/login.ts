import { api } from "@/global/api";
import { accessTokenManager } from "@/global/authentication/access-token-manager";
import { AccessToken } from "@/global/authentication/AccessToken";
import { useAuthentication } from "@/global/authentication/use-authentication";
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
}

export const requestLogin = async (username: string, password: string): Promise<LoginResult> => {
  const isAuthed = useAuthentication.getState().isAuthenticated;
  // 이미 인증정보가 있음
  if(isAuthed){
    return { code: "already-logined", message: "이미 로그인 중입니다." };
  }

  const response = await api
    .guest()
    .params({ username, password})
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
    }))

    return resolver.resolve();
  }