import { api } from "@/global/api";
import { ApiResponse } from "@/shared/res/api-response";





type Form = {
  email: string;
}

type EmailVerificationResult = {
  code: "success"
} | {
  code: "error"
  message: string;
}

export const requestEmailVerification = async (form: Form): Promise<EmailVerificationResult> => {
  const res = await api
    .user()
    .data(form)
    .post<null>('/user/email/verification');

  return res.resolver<EmailVerificationResult>()
  .SUCCESS(() => ({
    code: "success",
  }))
  .FIELD_VALIDATION_ERROR((error) => ({
    code: "error",
    message: error[0].message,
  }))
  .on("FAIL_TO_SEND_MAIL", () => ({
    code: "error",
    message: "메일 전송 중 오류가 발생했습니다.",
  }))
  .on("EMAIL_ALREADY_VERIFIED", () => ({
    code: "error",
    message: "이미 해당 이메일로 인증했습니다.",
  }))
  .resolve();
}