import { EDITOR_BOOK_QUERY_KEY } from "@/entities/book";
import { api } from "@/global/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";




type Form = {
  bookId: string;
  coverImage: File;
}

type ChangeBookCoverImageResult = {
  success: boolean;
  message: string;
}

const changeBookCoverImageApi = async ({ bookId, coverImage }: Form) => {
  const res = await api
    .user()
    .contentType("multipart/form-data")
    .data({ coverImage })
    .post(`/user/books/${bookId}/cover-image`);

  return res.resolver<ChangeBookCoverImageResult>()
    .SUCCESS((data) => ({
      success: true,
      message: res.description
    }))
    .resolve();
}

export const useChangeBookCoverImageMutation = (bookId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (coverImage: File) => changeBookCoverImageApi({
      bookId,
      coverImage
    }),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: EDITOR_BOOK_QUERY_KEY(bookId) });
      }
    }
  });

  return mutation;
}
