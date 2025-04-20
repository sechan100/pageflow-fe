import { api } from "@/global/api";
import { useQuery } from "@tanstack/react-query";
import { decode } from "he";
import { ReadableSection } from "../model/readable-section";

type Form = {
  bookId: string;
  sectionId: string;
}

const getSectionApi = async ({ bookId, sectionId }: Form): Promise<ReadableSection> => {
  const res = await api
    .guest()
    .get<ReadableSection>(`/reader/books/${bookId}/sections/${sectionId}`);
  if (!res.isSuccess()) {
    throw new Error(res.description);
  }
  return {
    ...res.data,
    content: decode(res.data.content),
  }
}

export const READABLE_SECTION_QUERY_KEY = (sectionId: string) => ['reader', 'section', sectionId];

export const useReadableSectionQuery = ({ bookId, sectionId }: Form) => {
  const query = useQuery({
    queryKey: READABLE_SECTION_QUERY_KEY(sectionId),
    queryFn: () => getSectionApi({ bookId, sectionId }),
  });

  return {
    ...query,
  }
}