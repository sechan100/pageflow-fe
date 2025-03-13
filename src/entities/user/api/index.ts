import { changePassword } from "./change-password";
import { requestEmailVerification } from "./email-verification-reques";
import { signup } from "./signup";
import { updateProfile } from "./update-profile";


export const UserApi = {
  requestEmailVerification,
  updateProfile,
  changePassword,
  signup
}