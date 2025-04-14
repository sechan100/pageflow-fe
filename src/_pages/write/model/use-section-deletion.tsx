import { useEditorSectionQuery } from "@/entities/editor";
import { useWritePageDialMenuStore } from "@/features/book";
import { useNextRouter } from "@/shared/hooks/useNextRouter";
import { useNotification } from "@/shared/ui/notification";
import { useDialog } from "@/shared/ui/use-dialog";
import { Trash2 } from "lucide-react";
import { useCallback, useEffect } from "react";
import { useDeleteSectionMutation } from "../api/delete-section";
import { useBookContext } from "./book-context";


export const useSectionDeletion = (sectionId: string) => {
  const { id: bookId } = useBookContext();
  const { data: section, isLoading: _isSectionLoading } = useEditorSectionQuery(bookId, sectionId);
  const isSectionLoading = section === undefined || _isSectionLoading

  const { router } = useNextRouter();
  const notification = useNotification();
  const { confirm } = useDialog();
  const { mutateAsync: deleteFolderAsync } = useDeleteSectionMutation(sectionId);
  const addDialAction = useWritePageDialMenuStore(s => s.addDialAction);

  const deleteSection = useCallback(async () => {
    if (isSectionLoading) return;
    const sectionDeletionConfirm = await confirm(`정말 "${section.title}" 섹션을 삭제하시겠습니까?`, {
      okText: "삭제",
      cancelText: "취소",
    })
    if (!sectionDeletionConfirm) return;
    const res = await deleteFolderAsync();
    if (res.success) {
      router.push(`/write/${bookId}`);
      notification.success("섹션를 삭제했습니다.");
    } else {
      notification.error("섹션 삭제에 실패했습니다.");
    }
  }, [bookId, confirm, deleteFolderAsync, isSectionLoading, notification, router, section]);

  // 섹션 삭제 버튼을 Dial에 추가
  useEffect(() => {
    return addDialAction({
      name: "섹션 삭제",
      icon: <Trash2 />,
      cb: deleteSection,
    })
  }, [addDialAction, deleteSection]);
}