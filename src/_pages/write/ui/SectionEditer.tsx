'use client'
import { NodeTitleField } from '@/features/book'
import { useNotification } from '@/shared/ui/notification'
import { SectionEditor as SectionEditorWidget, useSectionContent } from '@/widgets/editor'
import { Box, SxProps } from "@mui/material"
import { useCallback } from 'react'
import { useSectionTitleMutation } from '../api/change-section-title'
import { useSectionDeletion } from '../model/use-section-deletion'


type Props = {
  sectionId: string,
  sx?: SxProps
}
export const SectionEditer = ({
  sectionId,
  sx
}: Props) => {
  const { load } = useSectionContent(sectionId);
  const { mutateAsync } = useSectionTitleMutation(sectionId);
  const notification = useNotification();
  useSectionDeletion(sectionId);
  const { content, title, isLoading } = load();

  const saveTitle = useCallback(async (title: string) => {
    const res = await mutateAsync(title);
    if (res.success) {
      notification.success("제목을 변경했습니다.");
    } else {
      notification.error("제목 변경에 실패했습니다.");
    }
  }, [mutateAsync, notification]);

  if (content === undefined || isLoading) {
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
          title={title}
          onSave={saveTitle}
        />
      </Box>
      <SectionEditorWidget
        sectionId={sectionId}
        htmlContent={content}
      />
    </Box>
  )
}