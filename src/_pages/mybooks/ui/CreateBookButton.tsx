import { BookTitleField } from '@/features/book';
import { Field } from '@/shared/field';
import { SingleTextFieldModal } from '@/shared/ui/SingleTextFieldModal';
import {
  Button, SxProps
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { createBookApi } from '../api/create-book';

const getDefaultBookName = () => {
  const now = new Date();
  const yy = now.getFullYear().toString().slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `내 책(${yy}.${mm}.${dd})`;
};

type Props = {
  sx?: SxProps
}
export const CreateBookButton = ({
  sx
}: Props) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState<Field>({ value: '', error: null });

  // 모달이 열릴 때마다 title 초기화
  useEffect(() => {
    if (open) {
      setTitle({
        value: getDefaultBookName(),
        error: null
      });
    }
  }, [open]);

  // 생성 버튼 클릭
  const handleSubmit = useCallback(async () => {
    if (title.error) throw new Error('title이 유효하지 않습니다.');

    const book = await createBookApi({ title: title.value });
    // TODO: 이 책을 가지고 바로 write 페이지로 이동
  }, [title.error, title.value]);

  return (
    <>
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
      >
        + 새로운 책 집필하기
      </Button>
      <SingleTextFieldModal
        open={open}
        onClose={() => setOpen(false)}
        fieldComponent={
          <BookTitleField
            title={title}
            onChange={setTitle}
            sx={{ mb: 2 }}
          />
        }
        onSubmit={handleSubmit}
        modalTitle='새 책 만들기'
        submitText='생성'
        submitDisabled={!!title.error}
      />
    </>
  )
}