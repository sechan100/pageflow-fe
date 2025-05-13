'use client'
import { useNotification } from '@/shared/ui/notification';
import { createPlainTextEditorStore, PlainTextEditor, PlainTextEditorStore } from '@/shared/ui/PlainTextEditor';
import { Box, Button, Container, SxProps } from "@mui/material";
import { useCallback, useEffect, useRef } from 'react';
import { StoreApi, useStore } from 'zustand';
import { useChangeBookDescriptionMutation } from '../api/change-book-description';
import { useBookContext } from '../model/book-context';

type Props = {
  html: string | null;
  sx?: SxProps;
}
export const BookDescriptionEditor = ({
  html,
  sx
}: Props) => {
  const { id: bookId } = useBookContext();
  const { mutateAsync: saveDescriptionApi } = useChangeBookDescriptionMutation(bookId);
  const notification = useNotification();

  const storeRef = useRef(createPlainTextEditorStore({
    editorName: 'Book Description Editor',
    initialHtml: html,
    ctrl_s_save: true,
    imagePlugin: true,
  }));

  const canSave = useStore(storeRef.current, s => s.canSave);

  const onSave = useCallback(async (html: string) => {
    const res = await saveDescriptionApi(html);
    if (res.success) {
      notification.success('저장되었습니다.');
    } else {
      notification.error('저장에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  }, [notification, saveDescriptionApi]);

  // onSave 메서드 동기화
  useEffect(() => {
    storeRef.current.getState().setOnSave(onSave);
  }, [onSave]);

  return (
    <Container
      maxWidth="md"
      sx={{
        mt: 1,
        mb: 3,
      }}
    >
      <PlainTextEditor store={storeRef.current} />
      <Box sx={{
        display: 'flex',
        justifyContent: 'end',
      }}>
        <Button
          variant="outlined"
          disabled={!canSave}
          onClick={storeRef.current.getState().save}
        >
          저장하기
        </Button>
      </Box>
    </Container>
  )
}