import { PlainApiResponse } from "@/shared/res/api-response";
import axios from "axios";
import { getProxyBaseUrl } from "../proxy";
import { AccessToken } from "./AccessToken";
import { AccessTokenStorage, PrivatePropertyAccessTokenStorage } from "./AccessTokenStorage";
import { useAuthentication } from "./authentication";
import { SessionExpiredError } from "./SessionExpiredError";


// AccessToken 저장소 인스턴스를 생성
const storage: AccessTokenStorage = new PrivatePropertyAccessTokenStorage();


/** 
 * 유효한 AccessToken을 반환한다. storage에 유효한 토큰을 캐싱중이라면 반환하고, 없다면 refresh를 시도한다. 
 */
const ensureAccessToken: () => Promise<string> = async () => {
  const isAuthenticated = useAuthentication.getState().isAuthenticated;
  if (!isAuthenticated) {
    throw new Error("인증되지 않은 사용자입니다. accessToken을 가져올 수 없습니다.");
  }

  const isTokenExist: boolean = storage.isTokenExist();
  let isRefreshRequired: boolean = false;

  if (isTokenExist) {
    // 토큰 있음 => 만료여부 확인 후 refresh 요청을 보낼지 결정
    if (storage.isTokenExpired()) {
      isRefreshRequired = true;
    }
  } else {
    // 토큰 없음 -> refresh 요청을 보내야함
    isRefreshRequired = true;
  }

  if (!isRefreshRequired) {
    // refresh 요청이 필요없는 경우, 저장된 토큰을 반환
    return storage.getToken();
  }
  // refresh 요청 전송
  const res = await axios.post<PlainApiResponse<AccessToken>>(getProxyBaseUrl() + `/auth/refresh`);
  const code = res.data.code;
  switch (code) {
    case "SUCCESS":
      // 받아온 토큰 저장 후 반환.
      const token = res.data.data;
      storage.store(token);
      return token.compact;
    case "INVALID_COOKIE":
      throw new SessionExpiredError("세션쿠키가 유효하지 않습니다.");
    case "SESSION_EXPIRED":
      throw new SessionExpiredError();
    default:
      throw new Error("알 수 없는 오류가 발생했습니다.");
  }
}


export const accessTokenManager = {
  ensureAccessToken,

  storeToken: (token: AccessToken) => {
    storage.store(token);
  },

  clearToken: () => {
    storage.clear();
  },
}