'use client'
import { Folder, useFolderQuery } from '@/entities/book'
import { NodeTitleField } from '@/features/book'
import { useNotification } from '@/shared/notification'
import { Box, SxProps } from "@mui/material"
import { useCallback } from 'react'
import { useFolderTitleMutation } from '../api/change-folder-title'



type Props = {
  folderId: string,
  sx?: SxProps
}
export const FolderEditer = ({
  folderId,
  sx
}: Props) => {
  const { data, isLoading } = useFolderQuery(folderId);
  const { mutateAsync } = useFolderTitleMutation(folderId);
  const notification = useNotification();

  const saveTitle = useCallback(async (title: string) => {
    const res = await mutateAsync(title);
    if (res.success) {
      notification.success("제목을 변경했습니다.");
    } else {
      notification.error("제목 변경에 실패했습니다.");
    }
  }, [mutateAsync, notification]);


  if (data === undefined || isLoading) {
    return <div>loading...</div>
  }


  const folder = data as Folder;
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