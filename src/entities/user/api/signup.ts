import { api } from "@/global/api";
import { FieldError } from "@/shared/field";



export type SignupResult = {
  code: "success";
} | {
  code: "field-error";
  fieldErrors: FieldError[];
}

export type SignupForm = {
  username: string;
  password: string;
  email: string;
  penname: string;
}

export const signup = async (form: SignupForm): Promise<SignupResult> => {
  const res = await api
    .guest()
    .data(form)
    .post("/signup");

  return res.resolver<SignupResult>()
    .SUCCESS(() => ({ code: "success" }))
    .FIELD_VALIDATION_ERROR((fieldErrors) => ({
      code: "field-error",
      fieldErrors,
    }))
    .resolve();
}
