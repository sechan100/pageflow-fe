import { BookTitleField } from '@/features/book';
import { Field } from '@/shared/field';
import {
  Box,
  Button,
  Modal,
  Stack,
  SxProps,
  Typography
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


type CreateBookModalProps = {
  sx?: SxProps;
  open: boolean;
  onClose: () => void;
}
const CreateBookModal = ({
  sx,
  open,
  onClose
}: CreateBookModalProps) => {
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
    onClose();
  }, [onClose, title.error, title.value]);


  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="create-book-modal-title"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        borderRadius: 1,
        boxShadow: 24,
        p: 4,
        ...sx
      }}>
        <Typography
          id="create-book-modal-title"
          variant="h6"
          component="h2"
          sx={{ mb: 2 }}
        >
          새 책 만들기
        </Typography>

        <BookTitleField
          title={title}
          onChange={setTitle}
          sx={{ mb: 2 }}
        />

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
            variant="outlined"
            onClick={() => onClose()}
          >
            취소
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!!title.error}
          >
            생성
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};


type Props = {
  sx?: SxProps
}
export const CreateBookButton = ({
  sx
}: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
      >
        + 새로운 책 집필하기
      </Button>
      <CreateBookModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  )
}