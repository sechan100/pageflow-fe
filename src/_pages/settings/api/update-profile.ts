import { api } from "@/global/api";
import { ApiResponse } from "@/shared/res/api-response";
import { User } from '@/entities/user';




export type RequestForm = {
  penname: string | null;
  profileImage: File | null;
  toDefaultProfileImage: boolean;
}

export const updateProfileApi = async (requestForm: RequestForm): Promise<ApiResponse<User>> => {
  const formData = new FormData();

  // email, penname
  const emailPennameForm = {
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