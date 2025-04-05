import { useFolderQuery } from "@/entities/book";
import { useWritePageDialMenuStore } from "@/features/book";
import { useNextRouter } from "@/shared/hooks/useNextRouter";
import { useNotification } from "@/shared/ui/notification";
import { useDialog } from "@/shared/ui/use-dialog";
import { Trash2 } from "lucide-react";
import { useCallback, useEffect } from "react";
import { useDeleteFolderMutation } from "../api/delete-folder";
import { useBookContext } from "./book-context";


export const useFolderDeletion = (folderId: string) => {
  const { id: bookId } = useBookContext();
  const { data: folder, isLoading: _isFolderLoading } = useFolderQuery(folderId);
  const isFolderLoading = folder === undefined || _isFolderLoading

  const { router } = useNextRouter();
  const notification = useNotification();
  const { confirm } = useDialog();
  const { mutateAsync: deleteFolderAsync } = useDeleteFolderMutation(folderId);
  const addDialAction = useWritePageDialMenuStore(s => s.addDialAction);

  const deleteFolder = useCallback(async () => {
    if (isFolderLoading) return;
    const folderDeletionConfirm = await confirm(`정말 "${folder.title}" 폴더를 삭제하시겠습니까?`, {
      okText: "삭제",
      cancelText: "취소",
    })
    if (!folderDeletionConfirm) return;
    const res = await deleteFolderAsync();
    if (res.success) {
      notification.success("폴더를 삭제했습니다.");
      router.push(`/write/${bookId}`);
    } else {
      notification.error("폴더 삭제에 실패했습니다.");
    }
  }, [bookId, confirm, deleteFolderAsync, folder, isFolderLoading, notification, router]);

  // 폴더 삭제 버튼을 Dial에 추가
  useEffect(() => {
    return addDialAction({
      name: "폴더 삭제",
      icon: <Trash2 />,
      cb: deleteFolder,
    })
  }, [addDialAction, deleteFolder]);
}