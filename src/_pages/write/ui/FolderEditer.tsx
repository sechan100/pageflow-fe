'use client'
import { useFolderQuery } from '@/entities/book'
import { NodeTitleField } from '@/features/book'
import { useNotification } from '@/shared/ui/notification'
import { Box, SxProps } from "@mui/material"
import { useCallback } from 'react'
import { useFolderTitleMutation } from '../api/change-folder-title'
import { useFolderDeletion } from '../model/use-folder-deletion'



type Props = {
  folderId: string,
  sx?: SxProps
}
export const FolderEditer = ({
  folderId,
  sx
}: Props) => {
  const { data: folder, isLoading: _isFolderLoading } = useFolderQuery(folderId);
  const isFolderLoading = folder === undefined || _isFolderLoading

  const { mutateAsync: changeFolderTitleAsync } = useFolderTitleMutation(folderId);
  const notification = useNotification();
  useFolderDeletion(folderId);


  const saveTitle = useCallback(async (title: string) => {
    const res = await changeFolderTitleAsync(title);
    if (res.success) {
      notification.success("제목을 변경했습니다.");
    } else {
      notification.error("제목 변경에 실패했습니다.");
    }
  }, [changeFolderTitleAsync, notification]);



  if (isFolderLoading) {
    return <div>loading...</div>
  }

  return (
    <Box sx={{
      px: 3,
      height: '90vh',
      overflowY: 'auto',
    }}>
      <Box
        sx={{
          mt: 5,
          mx: 8
        }}
      >
        <NodeTitleField
          title={folder.title}
          onSave={saveTitle}
        />
      </Box>
    </Box>
  )
}