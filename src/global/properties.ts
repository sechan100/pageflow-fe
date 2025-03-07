import { ApiResponse, PlainApiResponse } from "@/shared/api/api-response";
import axios from "axios";
import { create } from "zustand";
import { getProxyBaseUrl } from "./proxy";




type ServerProperties = {
  refreshTokenExpireDays: number;
}

/**
 * 서버가 응답하지 않음.
 */
class ServerNotResponseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ServerNotResponseError';
  }
}

/**
 * 서버에서 필요한 프로퍼티를 가져온다.
 */
const fetchServerProperties = async () => {
  const res = await axios.get<PlainApiResponse<ServerProperties>>(getProxyBaseUrl() + '/server-properties');
  const code = res.data.code;
  if(code === "SUCCESS"){
    return res.data.data;
  } else {
    /**
     * client가 최초로 전송하는 proxy api 요청이므로, 응답이 없으면 서버가 죽은겨
     */
    throw new ServerNotResponseError(res.data.description);
  }
}

export type ApplicationProperties = {
  xUrl: string;
  refreshTokenExpireDays: number;
}

const serverProperties = await fetchServerProperties();

export const useApplicationProperties = create<ApplicationProperties>(() => ({
  // 트위터(X) url
  xUrl: 'https://x.pageflow.com',
  refreshTokenExpireDays: serverProperties.refreshTokenExpireDays,
}));