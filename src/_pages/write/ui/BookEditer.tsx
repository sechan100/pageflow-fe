'use client'
import { useEditorBookStore } from '@/entities/book'
import { BookTitleField } from '@/features/book'
import { Field } from '@/shared/field'
import { useNotification } from '@/shared/ui/notification'
import { BookStatusSetting } from '@/widgets/book-status'
import { Box, Paper, SxProps, Typography } from "@mui/material"
import { useCallback, useState } from 'react'
import { useChangeBookTitleMutation } from '../api/change-book-title'
import { BookCoverImageEditor } from './BookCoverImageEditor'
import { BookDescriptionEditor } from './BookDescriptionEditor'

type BookSettingProps = {
  text: string;
  children: React.ReactNode;
  sx?: SxProps;
}
const BookSetting = ({
  text,
  children,
  sx
}: BookSettingProps) => {

  return (
    <Paper
      elevation={1}
      sx={{
        p: 3,
        mb: 5,
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={sx}
      >
        {text}
      </Typography>
      {children}
    </Paper>
  )
}


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
      <BookSetting text="제목">
        <BookTitleField
          title={title}
          onChange={setTitle}
          onSave={changeBookTitle}
          saveDisabled={saveDisabled}
        />
      </BookSetting>
      <BookSetting text="표지 사진">
        <BookCoverImageEditor />
      </BookSetting>
      <BookSetting text="책 설명">
        <BookDescriptionEditor htmlContent={book.description} />
      </BookSetting>
      <BookSetting text="출판 설정">
        <BookStatusSetting book={book} />
      </BookSetting>
      <BookSetting text="공개 범위 설정">
        <BookDescriptionEditor htmlContent={book.description} />
      </BookSetting>
    </Box>
  )
}