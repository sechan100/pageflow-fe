'use client'
import { EditorFolder, useEditorFolderQuery } from '@/entities/editor'
import { NodeTitleField } from '@/features/book'
import { Field } from '@/shared/field'
import { useNotification } from '@/shared/ui/notification'
import { Box, SxProps } from "@mui/material"
import { useCallback, useMemo, useState } from 'react'
import { useFolderTitleMutation } from '../api/change-folder-title'
import { useBookContext } from '../model/book-context'
import { useFolderDeletion } from '../model/use-folder-deletion'


type FolderTitleFieldProps = {
  folder: EditorFolder;
  sx?: SxProps;
}
const FolderTitleField = ({
  folder,
  sx
}: FolderTitleFieldProps) => {
  const { mutateAsync: changeFolderTitleAsync } = useFolderTitleMutation(folder.id);
  const notification = useNotification();
  const [titleField, setTitleField] = useState<Field>({ value: folder.title, error: null });
  const saveDisabled = useMemo(() => {
    return titleField.error !== null || titleField.value === folder.title;
  }, [titleField, folder.title]);

  const saveTitle = useCallback(async (title: string) => {
    if (saveDisabled) {
      return;
    }
    const res = await changeFolderTitleAsync(title);
    if (res.success) {
      notification.success("제목을 변경했습니다.");
    } else {
      notification.error("제목 변경에 실패했습니다.");
    }
  }, [changeFolderTitleAsync, notification, saveDisabled]);

  return (
    <>
      <NodeTitleField
        title={titleField}
        onChange={setTitleField}
        onSave={saveTitle}
        saveDisabled={saveDisabled}
      />
    </>
  )
}


type Props = {
  folderId: string,
  sx?: SxProps
}
export const FolderEditer = ({
  folderId,
  sx
}: Props) => {
  const book = useBookContext();
  const { data: folder, isLoading: isFolderLoading } = useEditorFolderQuery(book.id, folderId);
  useFolderDeletion(folderId);


  if (folder === undefined || isFolderLoading) {
    return <div>loading...</div>
  }

  return (
    <>
      <Box
        sx={{
          mt: 5,
          mx: 8
        }}
      >
        <FolderTitleField
          folder={folder}
        />
      </Box>
    </>
  )
}