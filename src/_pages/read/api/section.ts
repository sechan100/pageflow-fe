import { api } from "@/global/api";
import { ReadableSectionContent } from "../model/readable-content";

type Form = {
  bookId: string;
  sectionId: string;
}

export const getReadableSectionContentApi = async ({ bookId, sectionId }: Form): Promise<ReadableSectionContent> => {
  const res = await api
    .guest()
    .get<ReadableSectionContent>(`/reader/books/${bookId}/sections/${sectionId}`);
  if (!res.isSuccess) {
    throw new Error(res.description);
  }
  return res.data;
}