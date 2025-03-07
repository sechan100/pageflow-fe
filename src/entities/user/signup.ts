import { api } from "@/global/api";
import { FieldValidationResult } from "@/shared/field-validation";



export type SignupResult = {
  code: "success";
} | {
  code: "field-error";
  fieldValidationResult: FieldValidationResult;
}

export type SignupForm = {
  username: string;
  password: string;
  email: string;
  penname: string;
}

export const requestSignup = async (form: SignupForm): Promise<SignupResult> => {
  const res = await api
    .guest()
    .data(form)
    .post("/signup");

  const resolver = res.resolver<SignupResult>()
    .SUCCESS(() => ({ code: "success" }))
    .FIELD_VALIDATION_FAIL((fvr) => ({
      code: "field-error",
      fieldValidationResult: fvr
    }));

  return resolver.resolve();
}
