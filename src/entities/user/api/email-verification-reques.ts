import { api } from "@/global/api";
import { ApiResponse } from "@/shared/res/api-response";






export const requestEmailVerification = async (): Promise<ApiResponse<null>> => {
  return await api
    .user()
    .post<null>('/user/email/verification');
}