import { EDITOR_BOOK_QUERY_KEY } from "@/entities/book";
import { api } from "@/global/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";


type Form = {
  bookId: string;
  description: string;
}

type ChangeBookDescriptionResult = {
  success: boolean;
  message: string;
}

const changeBookDescriptionApi = async ({ bookId, description }: Form) => {
  const res = await api
    .user()
    .data({ description })
    .post(`/user/books/${bookId}/description`);

  return res.resolver<ChangeBookDescriptionResult>()
    .SUCCESS((data) => ({
      success: true,
      message: res.description
    }))
    .resolve();
}

export const useChangeBookDescriptionMutation = (bookId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (description: string) => changeBookDescriptionApi({
      bookId,
      description
    }),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: EDITOR_BOOK_QUERY_KEY(bookId) });
      }
    }
  });

  return mutation;
}