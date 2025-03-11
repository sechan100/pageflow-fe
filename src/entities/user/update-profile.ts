import { api } from "@/global/api";
import { User } from "./types";
import { ApiResponse } from "@/shared/res/api-response";




export type RequestForm = {
  email: string | null;
  penname: string | null;
  profileImage: File | null;
  toDefaultProfileImage: boolean;
}

export const updateProfileRequest = async (requestForm: RequestForm): Promise<ApiResponse<User>> => {
  const formData = new FormData();

  // email, penname
  const emailPennameForm = {
    email: requestForm.email,
    penname: requestForm.penname
  }
  formData.append('form', new Blob([JSON.stringify(emailPennameForm)], { type: 'application/json' }));

  // profileImage
  if (requestForm.profileImage) {
    console.log(requestForm.profileImage)
    formData.append('profileImage', requestForm.profileImage);
  }

  return await api
    .user()
    .contentType('multipart/form-data')
    .data(formData)
    .param("toDefaultProfileImage", requestForm.toDefaultProfileImage)
    .post<User>('/user/profile');
}