import { api } from "@/global/api";
import { ApiResponse } from "@/shared/res/api-response";






export const emailVerificationRequest = async (): Promise<ApiResponse<null>> => {
  return await api
    .user()
    .post<null>('/user/email/verification');
}