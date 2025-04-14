'use client'
import { EditorSection } from '@/entities/editor'
import { NodeTitleField } from '@/features/book'
import { Field } from '@/shared/field'
import { useNotification } from '@/shared/ui/notification'
import { SectionEditor as SectionEditorWidget, useSectionContent } from '@/widgets/section-editor'
import { Box, SxProps } from "@mui/material"
import { useCallback, useMemo, useState } from 'react'
import { useSectionTitleMutation } from '../api/change-section-title'
import { useBookContext } from '../model/book-context'
import { useSectionDeletion } from '../model/use-section-deletion'


type SectionTitleFieldProps = {
  section: EditorSection;
  sx?: SxProps;
}
const SectionTitleField = ({
  section,
  sx
}: SectionTitleFieldProps) => {
  const { mutateAsync } = useSectionTitleMutation(section.id);
  const notification = useNotification();
  const [titleField, setTitleField] = useState<Field>({ value: section.title, error: null });
  const saveDisabled = useMemo(() => titleField.error !== null || titleField.value === section.title, [titleField, section.title]);

  const saveTitle = useCallback(async (title: string) => {
    if (saveDisabled) {
      return;
    }
    const res = await mutateAsync(title);
    if (res.success) {
      notification.success("제목을 변경했습니다.");
    } else {
      notification.error("제목 변경에 실패했습니다.");
    }
  }, [mutateAsync, notification, saveDisabled]);

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
  sectionId: string,
  sx?: SxProps
}
export const SectionEditer = ({
  sectionId,
  sx
}: Props) => {
  const book = useBookContext();
  const { load } = useSectionContent(book.id, sectionId);
  const { section, isLoading } = load();
  useSectionDeletion(sectionId);

  if (section === null || isLoading) {
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
        <SectionTitleField
          section={section}
        />
      </Box>
      <SectionEditorWidget
        book={book}
        section={section}
      />
    </>
  )
}