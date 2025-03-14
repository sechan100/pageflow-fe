import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  SxProps
} from '@mui/material';

type Props = {
  sx?: SxProps;
  open: boolean;
  onClose: () => void;
}

const getDefaultBookName = () => {
  const now = new Date();
  const yy = now.getFullYear().toString().slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `내 책(${yy}.${mm}.${dd})`;
};


export const CreateBookModal = ({
  sx,
  open,
  onClose
}: Props) => {

  const [title, setTitle] = useState(getDefaultBookName());
  const [error, setError] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle(getDefaultBookName());
    }
  }, [open]);

  const handleSubmit = () => {
    if (title.trim() === '') {
      setError(true);
      return;
    }

    // 여기서 API 호출이나 상태 업데이트 등의 로직 처리
    console.log('새 책 생성:', title);

    handleClose();
  };

  const handleClose = () => {
    setError(false);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
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

        <TextField
          fullWidth
          label="제목"
          variant="outlined"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (e.target.value.trim() !== '') {
              setError(false);
            }
          }}
          error={error}
          helperText={error ? "제목을 입력해주세요" : ""}
          sx={{ mb: 3 }}
        />

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
            variant="outlined"
            onClick={handleClose}
          >
            취소
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
          >
            생성
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};