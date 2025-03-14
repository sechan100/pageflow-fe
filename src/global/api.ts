import { ApiResponse, ApiResponseImpl, PlainApiResponse } from "@/shared/res/api-response";
import axios, { AxiosRequestConfig } from "axios";
import { accessTokenManager } from "./authentication/access-token-manager";
import { getProxyBaseUrl } from "./proxy";



export type API = {
  data(data: any): API;
  params(params: any): API;
  param(key: string, value: string): API;
  contentType(type: string): API;

  get<D>(uri: string): Promise<ApiResponse<D>>;
  post<D>(uri: string): Promise<ApiResponse<D>>;
  delete<D>(uri: string): Promise<ApiResponse<D>>;
}



const BEARER = "Bearer ";

class AxiosAPI implements API {

  #config: AxiosRequestConfig; // axios 요청 설정 객체
  #auth: boolean; // 인증된 요청을 보낼 것인지(Authorization 헤더를 포함하는가)


  constructor(auth: boolean) {
    this.#config = {
      baseURL: getProxyBaseUrl(),
      headers: {
        "Content-type": "application/json; charset=UTF-8", // 요청타입
        "Accept": "application/json", // 응답타입
      }
    };
    this.#auth = auth;
  }

  /**
   * Request Body를 설정한다.
   * @param data 
   * @returns 
   */
  data(data: any) {
    this.#config.data = data;
    return this;
  }

  // queryString
  params(params: {
    [key: string]: string
  }) {
    this.#config.params = params;
    return this;
  }

  // queryString
  param(key: string, value: any) {
    this.#config.params = {
      ...this.#config.params,
      [key]: value
    }
    return this;
  }

  contentType(type: string) {
    this.#config.headers!["Content-Type"] = type;
    return this;
  }

  // 요청 전송
  async fetch<D>(): Promise<ApiResponse<D>> {
    // 전처리
    if (!this.#auth) {
      delete this.#config.headers?.Authorization;
    } else {
      this.#config.headers!.Authorization = BEARER + await accessTokenManager.ensureAccessToken();
    }

    // 요청 + 응답 시간 측정
    const startTime = performance.now();
    const axiosRes = await axios.request<PlainApiResponse<D>>(this.#config);
    const res = new ApiResponseImpl(axiosRes.data);
    const endTime = performance.now();
    const timeTaken = endTime - startTime;
    // 요청 + 응답 시간 측정 끝

    // 로깅
    console.debug([
      "============[ API Request ]============",
      `[URL]: ${this.#config.url}`,
      `[METHOD]: ${this.#config.method}`,
      `[DATA]: ${JSON.stringify(this.#config.data ?? null)}`,
      `[DELAY]: ${timeTaken}ms`,
      `[RES]: `,
      JSON.stringify(res, null, 2)
    ].join("\n"));

    return Promise.resolve(res);
  }

  get<D>(uri: string) {
    this.#config.method = "GET";
    this.#config.url = uri;
    return this.fetch<D>();
  }

  post<D>(uri: string) {
    this.#config.method = "POST";
    this.#config.url = uri;
    return this.fetch<D>();
  }

  delete<D>(uri: string) {
    this.#config.method = "DELETE";
    this.#config.url = uri;
    return this.fetch<D>();
  }

}

export const api = {
  user: () => new AxiosAPI(true),
  guest: () => new AxiosAPI(false)
}