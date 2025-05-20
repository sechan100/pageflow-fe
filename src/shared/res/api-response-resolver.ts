import { FieldError, ServerFieldValidationResult } from "../field";
import { ApiResponse } from "./api-response";
import { ApiResponseError } from "./ApiResponseError";


const toFieldErrors = (f: ServerFieldValidationResult): FieldError[] => {
  return f.invalidFields.map(({ field, message }) => ({ field, message }));
}


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
    if (typeof result === "function") {
      // handler
      this.#handlers[code] = result as (data: T) => R;
    } else {
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
    if (handler) {
      return handler(this.#response.data);
    } else {
      return this.#defaultHandler();
    }
  }

  get(): D {
    if (this.#response.isSuccess) {
      return this.#response.data;
    } else {
      throw new ApiResponseError(this.#response);
    }
  }

  SUCCESS(handler: (data: D) => R): ApiResponseResolver<D, R> {
    this.on("SUCCESS", handler);
    return this;
  }

  DATA_NOT_FOUND(handler: () => R): ApiResponseResolver<D, R> {
    return this.on("DATA_NOT_FOUND", handler);
  }

  RESOURCE_PERMISSION_DENIED(handler: () => R): ApiResponseResolver<D, R> {
    return this.on("RESOURCE_PERMISSION_DENIED", handler);
  }

  FIELD_VALIDATION_ERROR(
    handler: (fieldErrors: FieldError[], originalResult: ServerFieldValidationResult) => R
  ): ApiResponseResolver<D, R> {
    return this.on(
      "FIELD_VALIDATION_ERROR",
      (f: ServerFieldValidationResult) => handler(toFieldErrors(f), f)
    );
  }

  BAD_CREDENTIALS(handler: () => R): ApiResponseResolver<D, R> {
    return this.on("BAD_CREDENTIALS", handler);
  }

  BOOK_ACCESS_DENIED(handler: (description: string) => R): ApiResponseResolver<D, R> {
    return this.on("BOOK_ACCESS_DENIED", handler);
  }
}