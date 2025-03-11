import { ApiResponseResolver } from "./api-response-resolver";


export type PlainApiResponse<D> = {
  code: string;
  description: string;
  data: D;
}

export type ApiResponse<D> = {
  code: string; // unique한 응답 코드
  description: string; // 간단한 설명
  data: D;

  isSuccess(): boolean;
  is(code: string): boolean;
  resolver<R>(): ApiResponseResolver<D, R>;
}

export class ApiResponseImpl<D> implements ApiResponse<D> {
  code: string;
  description: string;
  data: D;

  constructor(response: PlainApiResponse<D>) {
    this.code = response.code;
    this.description = response.description;
    this.data = response.data;
  }

  isSuccess(): boolean {
    return this.code === "SUCCESS";
  }

  is(code: string): boolean {
    return this.code === code;
  }

  resolver<R>(): ApiResponseResolver<D, R> {
    return new ApiResponseResolver<D, R>(this);
  }
}