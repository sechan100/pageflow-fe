import { api } from "@/global/api";





export type RelocateForm = {
  bookId: string;
  targetNodeId: string;
  destFolderId: string;
  destIndex: number;
}

type Result = {
  code: "success"
} | {
  code: "error",
  message: string
}

export const relocateNodeApi = async (form: RelocateForm) => {
  const res = await api
  .user()
  .data({
    targetNodeId: form.targetNodeId,
    destFolderId: form.destFolderId,
    destIndex: form.destIndex
  })
  .post(`/user/books/${form.bookId}/toc/relocate-node`);

  return res.resolver<Result>()
  .SUCCESS(() => ({ code: "success" }))
  .DATA_NOT_FOUND(() => ({ code: "error", message: "데이터를 찾을 수 없습니다." }))
  .on("TOC_HIERARCHY_ERROR", () => ({ code: "error", message: "목차를 변경할 수 없습니다." }))
  .resolve();
}