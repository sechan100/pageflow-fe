import { api } from "@/global/api";




type Result = {
  success: true;
  url: string;
} | {
  success: false;
  message: string;
}

type Form = {
  bookId: string;
  sectionId: string;
  image: File;
}
export const uploadImageApi = async ({ bookId, sectionId, image }: Form): Promise<Result> => {
  const res = await api
  .user()
  .contentType("multipart/form-data")
  .data({ image })
  .post<{url: string}>(`/user/books/${bookId}/toc/sections/${sectionId}/upload-image`);

  return res.resolver<Result>()
  .SUCCESS(data => ({ success: true, url: data.url }))
  .FIELD_VALIDATION_ERROR(() => ({ success: false, message: "이미지 파일이 올바르지 않습니다." }))
  .defaultHandler(() => ({ success: false, message: "이미지 업로드에 실패했습니다. 잠시 후 다시 시도해주세요." }))
  .resolve();
}
