import { decode } from "he";
import { ApiResponseResolver } from "./api-response-resolver";

const decodeStringDataRecursive = (data: any): any => {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data === 'string') {
    return decode(data);
  }

  if (Array.isArray(data)) {
    return data.map(item => decodeStringDataRecursive(item));
  }

  if (typeof data === 'object') {
    const result: Record<string, any> = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        result[key] = decodeStringDataRecursive(data[key]);
      }
    }
    return result;
  }

  return data; // 다른 타입(number, boolean 등)은 그대로 반환
}

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
    this.data = decodeStringDataRecursive(response.data);
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