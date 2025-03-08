import { ApiResponse } from "./api-response";
import { ApiResponseError } from "./ApiResponseError";
import { FieldValidationResult } from "../field-validation";





export class ApiResponseResolver<D, R> {
  #response: ApiResponse<D>;
  #handlers: {
    [code: string]: (data: any) => R;
  } = {};
  #defaultHandler: () => R;

  constructor(response: ApiResponse<D>) {
    this.#response = response;
    this.#defaultHandler = () => {
      throw new Error("api 응답을 처리할 수 없습니다.")
    }
  }

  on<T>(code: string, result: ((data: T) => R) | R): ApiResponseResolver<D, R> {
    if(typeof result === "function"){
      // handler
      this.#handlers[code] = result as (data: T) => R;
    }else {
      // error 데이터
      this.on(code, () => result);
    }
    return this;
  }

  defaultHandler(handler: () => R): ApiResponseResolver<D, R> {
    this.#defaultHandler = handler;
    return this;
  }

  resolve(): R {
    const handler = this.#handlers[this.#response.code];
    if(handler) {
      return handler(this.#response.data);
    } else {
      return this.#defaultHandler();
    }
  }

  get(): D {
    if(this.#response.isSuccess()){
      return this.#response.data;
    } else {
      throw new ApiResponseError(this.#response);
    }
  }

  SUCCESS(handler: (data: D) => R): ApiResponseResolver<D, R> {
    this.on("SUCCESS", handler);
    return this;
  }

  FIELD_VALIDATION_FAIL(handler: (fieldValidationResult: FieldValidationResult) => R): ApiResponseResolver<D, R> {
    return this.on("FIELD_VALIDATION_FAIL", handler);
  }

  BAD_CREDENTIALS(handler: () => R): ApiResponseResolver<D, R> {
    return this.on("BAD_CREDENTIALS", handler);
  }
}