import { api } from "@/global/api";
import { FieldError } from "@/shared/field";


type Form = {
  currentPassword: string;
  newPassword: string;
}

type ChangePasswordResult = {
  code: "success";
} | {
  code: "field-error";
  fieldErrors: FieldError[];
}

export const changePasswordApi = async ({ currentPassword, newPassword }: Form): Promise<ChangePasswordResult> => {
  const data = {
    currentPassword,
    newPassword
  }
  const res = await api
    .user()
    .data(data)
    .post<void>('/user/password');

  return res.resolver<ChangePasswordResult>()
    .SUCCESS(() => ({ code: "success" }))
    .BAD_CREDENTIALS(() => ({
      code: "field-error",
      fieldErrors: [{
        field: "currentPassword",
        message: "현재 비밀번호가 일치하지 않습니다."
      }]
    }))
    .FIELD_VALIDATION_ERROR((fieldErrors) => ({
      code: "field-error",
      fieldErrors
    }))
    .on("PASSWORD_SAME_AS_BEFORE", () => ({
      code: "field-error",
      fieldErrors: [{
        field: "newPassword",
        message: "이전 비밀번호와 동일합니다."
      }]
    }))
    .resolve();
}