import { AUTHOR_PRIVATE_BOOK_QUERY_KEY } from "@/entities/book";
import { api } from "@/global/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type ServerBookStatusCmd =
  "PUBLISH" |
  "START_REVISION" |
  "CANCEL_REVISION" |
  "MERGE_REVISION";

type Form = {
  bookId: string;
  cmd: ServerBookStatusCmd;
}

type ChangeBookStatusResult = {
  success: boolean;
  message: string;
}

const changeBookStatusApi = async ({ bookId, cmd }: Form): Promise<ChangeBookStatusResult> => {
  const res = await api
    .user()
    .param("cmd", cmd)
    .post(`/user/books/${bookId}/status`);

  return res.resolver<ChangeBookStatusResult>()
    .SUCCESS((data) => ({
      success: true,
      message: res.description,
    }))
    .resolve();
}

export const useBookStatusMutation = (bookId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cmd: ServerBookStatusCmd) => changeBookStatusApi({ bookId, cmd }),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: AUTHOR_PRIVATE_BOOK_QUERY_KEY(bookId) });
      }
    },
  });
}


