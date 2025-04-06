import { BOOK_QUERY_KEY } from "@/entities/book";
import { api } from "@/global/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";


type Form = {
  bookId: string;
  title: string;
}

type ChangeBookTitleResult = {
  success: boolean;
  message: string;
}

const changeBookTitleApi = async ({ bookId, title }: Form) => {
  const res = await api
    .user()
    .data({ title })
    .post(`/user/books/${bookId}/title`);

  return res.resolver<ChangeBookTitleResult>()
    .SUCCESS((data) => ({
      success: true,
      message: res.description
    }))
    .resolve();
}


export const useChangeBookTitleMutation = (bookId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (title: string) => changeBookTitleApi({
      bookId,
      title
    }),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: BOOK_QUERY_KEY(bookId) });
      }
    }
  });

  return mutation;
}