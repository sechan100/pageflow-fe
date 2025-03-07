import { err, ok, Result } from "neverthrow";
import { ApiResponse } from "./api-response";
import { FieldValidationResult, InvalidField } from "@/shared/field-validation";
import { ApiResponseError } from "./ApiResponseError";





export class ApiResponseResolver<D> {
  #response: ApiResponse<D>;
  #handlers: {
    [code: string]: (data: any) => FieldValidationResult;
  } = {};
  #successHandler: (data: D) => D;
  #defaultHandler: () => FieldValidationResult;

  constructor(response: ApiResponse<D>) {
    this.#response = response;
    this.#successHandler = (data: D) => data;
    this.#defaultHandler = () => {
      throw new Error("api 응답을 처리할 수 없습니다.")
    }
  }

  on<T>(code: string, fieldOrhandler: FieldValidationResult | InvalidField | ((errorData: T) => FieldValidationResult)): ApiResponseResolver<D> {
    if(typeof fieldOrhandler === "function"){
      // handler
      this.#handlers[code] = fieldOrhandler;  
    } else if("invalidFields" in fieldOrhandler) {
      // FieldValidationResult
      this.on(code, () => fieldOrhandler);
    } else {
      // InvalidField
      this.on(code, () => {
        return { invalidFields: [fieldOrhandler] }
      });
    }
    return this;
  }

  defaultHandler(handler: () => FieldValidationResult): ApiResponseResolver<D> {
    this.#defaultHandler = handler;
    return this;
  }

  resolve(): Result<D, FieldValidationResult> {
    // 성공이면 그대로 반환
    if(this.#response.isSuccess()){
      this.#successHandler(this.#response.data);
      return ok(this.#response.data);
    }
    // 에러처리
    const handler = this.#handlers[this.#response.code];
    if(handler) {
      return err(handler(this.#response.data));
    } else {
      return err(this.#defaultHandler());
    }
  }

  resolveMap<T>(mapper: (data: D) => T): Result<T, FieldValidationResult> {
    return this.resolve().map(mapper);
  }

  resolveGet<T>(successData: T): Result<T, FieldValidationResult> {
    return this.resolve().map(() => successData);
  }

  getSuccessData(): D {
    if(this.#response.isSuccess()){
      this.#successHandler(this.#response.data);
      return this.#response.data;
    } else {
      throw new ApiResponseError(this.#response);
    }
  }

  /**
   * 기본 SUCCESS 핸들러는 데이터를 그대로 반환합니다.
   * @param handler 
   * @returns 
   */
  SUCCESS(handler: (data: D) => void): ApiResponseResolver<D> {
    this.#successHandler = (data: D) => {
      handler(data);
      return data;
    }
    return this;
  }

  FIELD_VALIDATION_FAIL(): ApiResponseResolver<D> {
    return this.on("FIELD_VALIDATION_FAIL", (errorData: FieldValidationResult) => {
      return errorData;
    });
  }

  USER_NOT_FOUND(): ApiResponseResolver<D> {
    return this.on("USER_NOT_FOUND", {
      field: "username",
      message: "사용자를 찾을 수 없습니다. 아이디를 확인해주세요."
    });
  }

  BAD_CREDENTIALS(): ApiResponseResolver<D> {
    return this.on("BAD_CREDENTIALS", {
      field: "password",
      message: "비밀번호가 일치하지 않습니다."
    });
  }
}