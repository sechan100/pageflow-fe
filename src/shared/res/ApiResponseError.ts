import { ApiResponse } from "./api-response";

export class ApiResponseError extends Error {
  #response: ApiResponse<any>;

  constructor(response: ApiResponse<any>) {
    super(response.description);
    this.#response = response;
  }

  get response(): ApiResponse<any> {
    return this.#response;
  }
}