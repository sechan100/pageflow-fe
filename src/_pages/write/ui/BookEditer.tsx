'use client'
import { useEditorBookStore } from '@/entities/book'
import { BookTitleField } from '@/features/book'
import { Field } from '@/shared/field'
import { useNotification } from '@/shared/ui/notification'
import { Box, SxProps } from "@mui/material"
import { useCallback, useState } from 'react'
import { useChangeBookTitleMutation } from '../api/change-book-title'



type Props = {
  sx?: SxProps
}
export const BookEditer = ({
  sx
}: Props) => {
  const book = useEditorBookStore(s => s.book)
  const notification = useNotification();
  const [title, setTitle] = useState<Field>({ value: book.title, error: null });
  const { mutateAsync: changeBookTitleAsync } = useChangeBookTitleMutation(book.id);

  const saveDisabled = title.error !== null || title.value === book.title;

  const changeBookTitle = useCallback(async () => {
    if (saveDisabled) {
      return;
    }
    const res = await changeBookTitleAsync(title.value);
    if (res.success) {
      notification.success('책이 수정되었습니다.');
    } else {
      notification.error(res.message);
    }
  }, [saveDisabled, changeBookTitleAsync, title.value, notification]);

  return (
    <Box
      sx={{
        mt: 5,
        mx: 8
      }}
    >
      <BookTitleField
        title={title}
        onChange={setTitle}
        onSave={changeBookTitle}
        saveDisabled={saveDisabled}
      />
    </Box>
  )
}