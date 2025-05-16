'use client'
import { registerCtrlShortCut } from '@/shared/keyboard';
import { useNotification } from '@/shared/ui/notification';
import { createPlainTextEditorStore, PlainTextEditor } from '@/shared/ui/PlainTextEditor';
import { Box, Button, Container, SxProps } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from 'react';
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
    imagePlugin: true,
  }));

  const [canSave, setCanSave] = useState(false);

  // canSave 동기화
  useEffect(() => {
    const unsubscribe = storeRef.current.subscribe(s => s.html, (newHtml) => {
      const { isHtmlEmpty } = storeRef.current.getState();
      const isHtmlChanged = html !== newHtml;
      setCanSave(!isHtmlEmpty && isHtmlChanged);
    });
    return () => unsubscribe();
  }, [html, storeRef]);

  const save = useCallback(async () => {
    if (!canSave) {
      return;
    }
    const { html } = storeRef.current.getState();
    const res = await saveDescriptionApi(html);
    if (res.success) {
      notification.success('저장되었습니다.');
    } else {
      notification.error('저장에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  }, [canSave, notification, saveDescriptionApi]);

  // save 단축키 등록
  const registerSaveShortCut = useCallback((el: HTMLDivElement | null) => {
    if (!el) return;
    registerCtrlShortCut({
      element: el,
      key: 's',
      cb: save,
    })
  }, [save]);

  return (
    <Container
      maxWidth="md"
      sx={{
        mt: 1,
        mb: 3,
      }}
      ref={registerSaveShortCut}
    >
      <PlainTextEditor store={storeRef.current} />
      <Box sx={{
        display: 'flex',
        justifyContent: 'end',
      }}>
        <Button
          variant="outlined"
          disabled={!canSave}
          onClick={save}
        >
          저장하기
        </Button>
      </Box>
    </Container>
  )
}