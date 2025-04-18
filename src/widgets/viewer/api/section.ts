import { ReadOnlySection } from "@/entities/reader";
import { api } from "@/global/api";
import { useQuery } from "@tanstack/react-query";
import { decode } from "he";

type Form = {
  bookId: string;
  sectionId: string;
}

const getSectionApi = async ({ bookId, sectionId }: Form): Promise<ReadOnlySection> => {
  const res = await api
    .guest()
    .get<ReadOnlySection>(`/reader/books/${bookId}/sections/${sectionId}`);
  if (!res.isSuccess()) {
    throw new Error(res.description);
  }
  return {
    ...res.data,
    content: decode(res.data.content),
  }
}

export const READ_ONLY_SECTION_QUERY_KEY = (sectionId: string) => ['section', sectionId];

export const useReadOnlySectionQuery = ({ bookId, sectionId }: Form) => {
  const query = useQuery({
    queryKey: READ_ONLY_SECTION_QUERY_KEY(sectionId),
    queryFn: () => getSectionApi({ bookId, sectionId }),
  });

  return {
    ...query,
  }
}