import { SECTION_QUERY_KEY, useBookStore } from "@/entities/book";
import { api } from "@/global/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";




type Form = {
  bookId: string;
  sectionId: string;
  title: string;
}

type changeSectionTitleResult = {
  success: boolean;
  message: string;
}

const changeSectionTitleApi = async ({ bookId, sectionId, title}: Form) => {
  const res = await api
  .user()
  .data({ title })
  .post(`/user/books/${bookId}/toc/sections/${sectionId}`);


  return res.resolver<changeSectionTitleResult>()
  .SUCCESS((data) => ({
    success: true,
    message: res.description
  }))
  .resolve();
}

export const useSectionTitleMutation = (sectionId: string) => {
  const book = useBookStore(s => s.book);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (title: string) => changeSectionTitleApi({
      bookId: book.id,
      sectionId,
      title
    }),
    onSuccess: (res) => {
      if(res.success){
        queryClient.invalidateQueries({ queryKey: SECTION_QUERY_KEY(sectionId) });
      }
    }
  });
}