import { useWritePageDialMenuStore } from '@/features/book';
import { registerCtrlShortCut } from '@/shared/keyboard';
import { $getHtmlSerializedEditorState } from '@/shared/lexical/$getHtmlSerializedEditorState';
import { useUserInputChangeUpdateListener } from '@/shared/lexical/use-user-input-change-update-listener';
import { useNotification } from "@/shared/ui/notification";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { SpeedDialIcon } from '@mui/material';
import { $getSelection } from 'lexical';
import { debounce } from "lodash";
import { SaveIcon } from 'lucide-react';
import { useCallback, useEffect, useMemo } from "react";
import { useSectionContent } from "./use-section-content";


const AUTO_SAVE_INTERVAL = 4000;

/**
 * lexical context 안에서 section 내용을 저장하는 기능을 추가한다.
 * WritePageDial과 단축키, 그리고 자동 저장 기능등
 */
export const useSectionEditorSave = (bookId: string, sectionId: string) => {
  const [editor] = useLexicalComposerContext();
  const setMainDial = useWritePageDialMenuStore(s => s.setMainDial);
  const { save, sync } = useSectionContent(bookId, sectionId);
  const notification = useNotification();

  const saveToServer = useCallback(async () => {
    // editor의 내용을 서버와 동기화
    const res = await sync();
    if (res.result === 'success') {
      notification.show('저장되었습니다.', {
        severity: 'success',
        autoHideDuration: 1000,
      });
    } else if (res.result === 'lastest') {
      return;
    } else {
      notification.error('저장에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  }, [notification, sync]);

  const saveToServerDebounce = useMemo(() => debounce(saveToServer, AUTO_SAVE_INTERVAL), [saveToServer]);

  // editor의 현재 내용을 로컬스토리지에 저장
  const saveEditorState = useCallback(() => {
    editor.read(async () => {
      // selection의 node가 1개라는 것은 현재 커서를 단일 위치에 두고 텍스트를 작성하고 있다는 것임
      const selection = $getSelection();
      if (!selection) return;
      const nodes = selection.getNodes();
      if (nodes.length !== 1) return;

      const html = $getHtmlSerializedEditorState();
      save(html);
      saveToServerDebounce();
    })
  }, [editor, save, saveToServerDebounce]);

  const manualSave = useCallback(() => {
    saveToServerDebounce.cancel();
    saveToServer();
  }, [saveToServer, saveToServerDebounce]);

  // save 단축키 등록
  useEffect(() => {
    const element = editor.getRootElement();
    if (!element) return;

    return registerCtrlShortCut({
      element,
      key: 's',
      cb: manualSave,
    })
  }, [editor, manualSave]);

  // 자동저장 설정
  useUserInputChangeUpdateListener(saveEditorState);

  // Main Dial에 저장 버튼 등록
  useEffect(() => {
    const cleanup = setMainDial({
      name: '저장',
      icon: <SpeedDialIcon openIcon={<SaveIcon />} />,
      cb: manualSave,
    });

    return cleanup;
  }, [setMainDial, manualSave]);
}